---
sidebar_position: 3
---

# Contract作成

IBCを用いて2台帳間で転送できるトークンを実装していきます。

[ICS-20](https://github.com/cosmos/ibc/tree/main/spec/app/ics-020-fungible-token-transfer)
というトークン転送規格がありますが、ここではサポートしません。

ICS-20ではトークンの発行元をdenominationを用いて区別しますが、今回実装するMiniTokenでは発行元の台帳を区別せずに扱います。

## 基本機能


以下のような基本的な操作機能を備えます。

- `mint`: 指定したアカウントに対してトークンを新規発行する
- `burn`: 自身のトークンを償却する
- `transfer`: 自身のトークンを他のアカウントへ転送する

また、状態参照機能を持ちます。
- `balanceOf`: あるアカウントのトークン残高を取得する

状態としては以下を持ちます。
- `balances`: 各アカウントのトークン残高
- `owner`: mintなどの特権的な操作が許可されるアカウント

### constructor

ここでは単純に、コントラクトを生成したアカウントをownerとしています。

```solidity title="contracts/app/MiniToken.sol"
address private owner;

constructor() {
    owner = msg.sender;
}
```
### mint

指定されたアカウントに対して、指定量だけトークンを増加します。
`_mint`は、後でロジックを他の内部処理から呼び出したいので定義しています。

```solidity
mapping(address => uint256) private _balances;

function mint(address account, uint256 amount) onlyOwner external {
    require(_mint(account, amount), "invalid address");
}

function _mint(address account, uint256 amount) internal returns (bool) {
    if (account == address(0)) {
        return false;
    }
    _balances[account] += amount;
    return true;
}
```

`onlyOwner`などのmodifier実装の説明は取り上げませんが、気になる方はソースコードを参照してください。

### burn

指定されたアカウントに対して、指定量だけトークンを削減します。

```solidity
function burn(address account, uint256 amount) onlyOwner external {
    _burn(account, amount);
}

function _burn(address account, uint256 amount) internal returns (bool) {
    uint256 accountBalance = _balances[account];
    if (accountBalance < amount) {
        return false;
    }
    _balances[account] = accountBalance - amount;
    return true;
}
```

### transfer

トークンを他のアカウントへ送ります。

```solidity
function transfer(address to, uint256 amount) external {
    require(to != address(0), "Token: invalid address");
    uint256 balance = _balances[msg.sender];
    require(_balances[msg.sender] >= amount, "Token: amount shortage");
    _balances[msg.sender] -= amount;
    _balances[to] += amount;
}
```

### balanceOf

アカウントの残高を取得します。

```solidity
function balanceOf(address account) external view returns (uint256) {
    require(account != address(0), "Token: invalid address");
    return _balances[account];
}
```

## IBC関連

上記の基本機能を元に、IBCに必要な処理を実装していきます。

### Packet

台帳間のコミュニケーションに用いるIBC Packetを定義します。

Packetに関して詳しく知りたい方は
[ICS 004](https://github.com/cosmos/ibc/tree/main/spec/core/ics-004-channel-and-packet-semantics)
を参照してください。

MiniTokenPacketDataは、MiniTokenを転送元台帳から転送先台帳に対して転送するのに必要な情報を保持します。

```proto title="/proto/lib/Packet.proto"
message MiniTokenPacketData {
    // the token amount to be transferred
    uint64 amount = 1;
    // the sender address
    bytes sender = 2;
    // the recipient address on the destination chain
    bytes receiver = 3;
}
```

- amount: 送金するトークン量
- sender: 転送元台帳上の送金元アカウント
- receiver: 転送先台帳上の送金先アカウント

Packetを定義したら
[solidity-protobuf](https://github.com/datachainlab/solidity-protobuf)を用いてsolファイルを生成します。

まず、solidity-protobufを取得し、必要なモジュールをインストールします。
yui-ibc-solidityが指定するrevisionについての詳細は以下を参照ください。

https://github.com/hyperledger-labs/yui-ibc-solidity/tree/v0.3.3#for-developers

```sh
git clone https://github.com/datachainlab/solidity-protobuf.git
cd solidity-protobuf
git checkout fce34ce0240429221105986617f64d8d4261d87d
pip install -r requirements.txt
```

続いて、作業ディレクトリ側で、solファイルを生成します。

```sh
cd <tutorial dir>
make SOLPB_DIR=/path/to/solidity-protobuf proto-sol
```

### constructor改修

yui-ibc-solidityの定義するIBC/TAO層のコントラクトとして、以下をMiniTokenへ指定できるようにします。
なお、TAO層は、"transport, authentication, & ordering"を表し、アプリケーションロジックに依存しないIBCのコア機能を扱っています。

- IBCHandler

```solidity
IBCHandler ibcHandler;

constructor(IBCHandler ibcHandler_) {
    owner = msg.sender;
    ibcHandler = ibcHandler_;
}
```

### sendTransfer

Tokenに対して新たな操作機能を追加します。
`sendTransfer`は、先程定義したMiniTokenPacketDataを用いて、相手の台帳にトークンを送るためのメソッドです。

```solidity
function sendTransfer(
    string calldata denom,
    uint64 amount,
    address receiver,
    string calldata sourcePort,
    string calldata sourceChannel,
    uint64 timeoutHeight
) external {
    require(_burn(msg.sender, amount));

    _sendPacket(
        MiniTokenPacketData.Data({
            amount: amount,
            sender: abi.encodePacked(msg.sender),
            receiver: abi.encodePacked(receiver)
        }),
        sourcePort,
        sourceChannel,
        timeoutHeight
    );
}
```

続いて、Packet登録処理`_sendPacket`を実装します。
`IBCHandler.sendPacket`を呼び出すことで、送信すべきPacketが登録されます。

```solidity
function _sendPacket(MiniTokenPacketData.Data memory data, string memory sourcePort, string memory sourceChannel, uint64 timeoutHeight) virtual internal {
    (Channel.Data memory channel, bool found) = ibcHandler.getChannel(sourcePort, sourceChannel);
    require(found, "channel not found");
    ibcHandler.sendPacket(Packet.Data({
        sequence: ibcHandler.getNextSequenceSend(sourcePort, sourceChannel),
        source_port: sourcePort,
        source_channel: sourceChannel,
        destination_port: channel.counterparty.port_id,
        destination_channel: channel.counterparty.channel_id,
        data: MiniTokenPacketData.encode(data),
        timeout_height: Height.Data({revision_number: 0, revision_height: timeoutHeight}),
        timeout_timestamp: 0
    }));
}
```

### IIBCModule

IBC ModuleでのChannelハンドシェイクやPacketを受信した際などに、MiniTokenへコールバックしてもらう必要があります。
yui-ibc-solidityで定義される[IIBCModule](https://github.com/hyperledger-labs/yui-ibc-solidity/blob/v0.3.3/contracts/core/05-port/IIBCModule.sol)インタフェースを実装していきます。

```solidity
interface IIBCModule {
    function onChanOpenInit(
        Channel.Order,
        string[] calldata connectionHops,
        string calldata portId,
        string calldata channelId,
        ChannelCounterparty.Data calldata counterparty,
        string calldata version
    ) external;

    function onChanOpenTry(
        Channel.Order,
        string[] calldata connectionHops,
        string calldata portId,
        string calldata channelId,
        ChannelCounterparty.Data calldata counterparty,
        string calldata version,
        string calldata counterpartyVersion
    ) external;

    function onChanOpenAck(string calldata portId, string calldata channelId, string calldata counterpartyVersion) external;

    function onChanOpenConfirm(string calldata portId, string calldata channelId) external;

    function onChanCloseInit(string calldata portId, string calldata channelId) external;

    function onChanCloseConfirm(string calldata portId, string calldata channelId) external;

    function onRecvPacket(Packet.Data calldata, address relayer) external returns (bytes memory);

    function onAcknowledgementPacket(Packet.Data calldata, bytes calldata acknowledgement, address relayer) external;
}
```

上記のうち、トークンに関わる処理は主に以下で扱います。
- onRecvPacket
- onAcknowledgementPacket

台帳間のChannel確立の際に実施したい処理がある場合は、以下の処理を実装する必要があります。
今回のケースでは特に考慮しません。
- onChanOpenInit
- onChanOpenTry
- onChanOpenAck
- onChanOpenConfirm
- onChanCloseInit
- onChanCloseConfirm

IBCにおけるChannelのライフサイクルについて詳しく知りたい方は、以下を参照ください。

https://github.com/cosmos/ibc/blob/main/spec/core/ics-004-channel-and-packet-semantics/README.md

#### onRecvPacket

Packetの内容に合わせて、指定された送金先アカウントに対してトークンを新規作成します。

トークン転送先台帳上でMiniTokenPacketDataを受信すると呼び出されます。

処理の成否をAcknowledgementとして返します。

```solidity
function onRecvPacket(Packet.Data calldata packet, address relayer) onlyIBC external virtual override returns (bytes memory acknowledgement) {
    MiniTokenPacketData.Data memory data = MiniTokenPacketData.decode(packet.data);
    return _newAcknowledgement(
        _mint(data.receiver.toAddress(), data.amount)
    );
}
```

#### onAcknowledgementPacket

転送先で処理が失敗した場合には、送金元アカウントに対してトークンを償還します。

トークン転送元台帳上で、Acknowledgementを受信すると呼び出されます。


```solidity
function onAcknowledgementPacket(Packet.Data calldata packet, bytes calldata acknowledgement, address relayer) onlyIBC external virtual override {
    if (!_isSuccessAcknowledgement(acknowledgement)) {
        _refundTokens(MiniTokenPacketData.decode(packet.data));
    }
}
```

## ここで取り扱わなかった項目

今回実装したトークンはICS-20とは異なりますが、ここではその違いをいくつか紹介します。

尚、ICS-20の実装例としては以下を参照ください。

https://github.com/hyperledger-labs/yui-ibc-solidity/tree/v0.3.3/contracts/apps

### 通貨単位の区別

ICS-20では通貨単位（denominationまたはdenom）を
`{ics20Port}/{ics20Channel}/{denom}`として表現します。

通貨単位を用いて、ICS-20トークンを元のチェーンまで遡ることが可能です。詳細については、以下を参照ください。

https://github.com/cosmos/ibc-go/blob/main/docs/apps/transfer/overview.md#denomination-trace
