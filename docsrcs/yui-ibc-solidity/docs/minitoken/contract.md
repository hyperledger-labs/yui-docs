---
sidebar_position: 3
---

# Create a contract

We will implement a token that can be transferred between two ledgers using IBC.

There is a token standard called [ICS-20](https://github.com/cosmos/ibc/tree/master/spec/app/ics-020-fungible-token-transfer),
but we will use a simple one here.

While ICS-20 uses denomination to distinguish the source ledger,
the MiniToken implemented here handles the issuer's ledger without distinction.

## Basic Functions

It has the following basic operational functions:

- mint: issue a new token for a given account
- burn: burn your own token
- transfer: Transfer your token to another account.

It also has a state reference function:
- balanceOf: to get the token balance of an account.

The following states are also available:
- balance: the balance of each account
- owner: An account that is allowed to perform privileged operations such as mint.

### constructor

In this example, we simply use the account that generated the contract as the owner.

```
address private owner;

constructor() public {
    owner = msg.sender;
}
```
### mint

Increments the token by the specified amount for the specified account.
The `_mint` is defined because we want to call the logic later from other internal processes.

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

We won't cover the description of modifier implementations such as `onlyOwner`,
so please refer to the source code if you are interested.

### burn

Reduces tokens by the specified amount for the specified account.

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

Sends some tokens to another account.

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

Returns the balance of an account.

```solidity
function balanceOf(address account) external view returns (uint256) {
    require(account != address(0), "Token: invalid address");
    return _balances[account];
}
```

## IBC-related

Based on the above functions, we will implement the necessary processes for IBC.

### Packet

Define an IBC Packet to be used for communication between ledgers.

If you want to know more about Packet, please refer to [ICS 004](https://github.com/cosmos/ibc/tree/master/spec/core/ics-004-channel-and-packet-semantics)
for more information.

MiniTokenPacketData holds the information necessary to transfer a MiniToken from the source ledger to the destination ledger.

```proto
message MiniTokenPacketData {
    // the token amount to be transferred
    uint64 amount = 1;
    // the sender address
    bytes sender = 2;
    // the recipient address on the destination chain
    bytes receiver = 3;
}
```

- amount: amount of tokens to send
- sender: the source account in the source ledger
- receiver: the destination account in the destination ledger

Once you have defined the Packet
Use [solidity-protobuf](https://github.com/datachainlab/solidity-protobuf) to generate the sol file.

```sh
git clone https://github.com/datachainlab/solidity-protobuf.git
cd solidity-protobuf
pip install -r requirements.txt
./run.sh --input <tutorial dir>/proto/lib/Packet.proto --output <tutorial dir>/contracts/lib
```

### Modify constructor

As a contract of the IBC/TAO layer defined by yui-ibc-solidity, the following can be specified in MiniToken.
The TAO layer represents "transport, authentication, & ordering" and handles core IBC functions independent of the application logic.

- IBCHandler
- IBCHost

```solidity
IBCHandler ibcHandler;
IBCHost ibcHost;

constructor(IBCHost host_, IBCHandler ibcHandler_) public {
    owner = msg.sender;

    ibcHost = host_;
    ibcHandler = ibcHandler_;
}
```

### sendTransfer

Adds a new manipulation function for Token.
We will add a new manipulation function for Token.
`sendTransfer` is a method to send a token to the other party's ledger using the MiniTokenPacketData that we defined earlier.

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

The next step is to implement the Packet registration process `_sendPacket`.
By calling `IBCHandler.sendPacket`, the packet to be sent will be registered.

```solidity
// These two variables can be passed when initializing Token contract.
//IBCHandler ibcHandler;
//IBCHost ibcHost;

function _sendPacket(MiniTokenPacketData.Data memory data, string memory sourcePort, string memory sourceChannel, uint64 timeoutHeight) virtual internal {
    (Channel.Data memory channel, bool found) = ibcHost.getChannel(sourcePort, sourceChannel);
    require(found, "channel not found");
    ibcHandler.sendPacket(Packet.Data({
        sequence: ibcHost.getNextSequenceSend(sourcePort, sourceChannel),
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

### IModuleCallbacks

When the IBC Module receives a Channel handshake or a Packet, it needs to be called back to MiniToken.
The following interfaces are defined in yui-ibc-solidity.

```solidity
interface IModuleCallbacks {
    function onChanOpenInit(Channel.Order, string[] calldata connectionHops, string calldata portId, string calldata channelId, ChannelCounterparty.Data calldata counterparty, string calldata version) external;
    function onChanOpenTry(Channel.Order, string[] calldata connectionHops, string calldata portId, string calldata channelId, ChannelCounterparty.Data calldata counterparty, string calldata version, string calldata counterpartyVersion) external;
    function onChanOpenAck(string calldata portId, string calldata channelId, string calldata counterpartyVersion) external;
    function onChanOpenConfirm(string calldata portId, string calldata channelId) external;
    function onChanCloseInit(string calldata portId, string calldata channelId) external;
    function onChanCloseConfirm(string calldata portId, string calldata channelId) external;

    function onRecvPacket(Packet.Data calldata) external returns(bytes memory);
    function onAcknowledgementPacket(Packet.Data calldata, bytes calldata acknowledgement) external;
}
```

Of the above, token-related processing is mainly handled in the following:
- onRecvPacket
- onAcknowledgementPacket

If there is any processing that you want to perform when establishing a channel between ledgers, you will need to implement the following processing:
- onChanOpenInit
- onChanOpenTry
- onChanOpenAck
- onChanOpenConfirm
- onChanCloseInit
- onChanCloseConfirm

In this case, we will not handle them specifically.

If you want to know more about Channel life cycle in IBC, please refer to the following:

https://github.com/cosmos/ibc/blob/ad99cb444ece8becae59f995b3371dc1ffc3ec5b/spec/core/ics-004-channel-and-packet-semantics/README.md#channel-lifecycle-management

#### onRecvPacket

Creates a new token for the specified payee account according to the contents of the Packet.

This function is called when a MiniTokenPacketData is received in the token transfer destination ledger.

It returns the success or failure of the process as an Acknowledgement.

```solidity
function onRecvPacket(Packet.Data calldata packet) onlyIBC external virtual override returns (bytes memory acknowledgement) {
    MiniTokenPacketData.Data memory data = MiniTokenPacketData.decode(packet.data);
    return _newAcknowledgement(
        _mint(data.receiver.toAddress(), data.amount)
    );
}
```

#### onAcknowledgementPacket

Redeems the token against the originating account if the transaction fails at the destination.

This function is called when an Acknowledgement is received in the token transfer source ledger.

```solidity
function onAcknowledgementPacket(Packet.Data calldata packet, bytes calldata acknowledgement) onlyIBC external virtual override {
    if (!_isSuccessAcknowledgement(acknowledgement)) {
        _refundTokens(MiniTokenPacketData.decode(packet.data));
    }
}
```

## Topics that were not dealt with here

The token implemented here is different from ICS-20.

For an example of ICS-20 implementation, please refer to the following:

https://github.com/hyperledger-labs/yui-ibc-solidity/tree/main/contracts/app

### Distinction between currency units

In ICS-20, the denomination or denom is represented as
`{ics20Port}/{ics20Channel}/{denom}`.

### Bank module

ICS-20 depends on the Cosmos [Bank module](https://docs.cosmos.network/master/modules/bank/).
