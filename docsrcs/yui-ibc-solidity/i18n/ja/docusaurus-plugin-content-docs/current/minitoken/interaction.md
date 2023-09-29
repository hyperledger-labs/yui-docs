---
sidebar_position: 5
---

# トークン転送の実行

ここまででデプロイした環境に対して、
`truffle console`を用いて、実際にトークンを転送します。

ここで使用する台帳とネットワーク名は以下のとおりです。
- IBC0 (network名は `ibc0`)
- IBC1 (network名は `ibc1`)

network名を指定したtruffle consoleの実行は以下のように行います。

```
truffle console --network=<network名>
```

台帳上のアクターはどちらの台帳でも以下の通りです。
- Alice (`accounts[1]`)
- Bob (`accounts[2]`)

## AliceおよびBobの初期残高を確認

以下の残高が0であることを確認しておきます。

- IBC0上のAlice
- IBC1上のBob

それぞれ、接続するnetworkを切り替えて以下のように確認できます。

```js
// i = 1 for Alice, i = 2 for Bob
MiniToken.deployed()
    .then((instance) => instance.balanceOf(accounts[i]))
```

## 台帳IBC0上でAliceにMint

AliceにMiniTokenを100だけ用意します。

```js
const accounts = await web3.eth.getAccounts();
const alice = accounts[1];

await MiniToken.deployed().then(instance => instance.mint(alice, 100));
```

`mint`が成功すると、`Mint`イベントが発生します。これを確認するには、以下のようにします。

```js
MiniToken.deployed()
    .then(instance => instance.getPastEvents("Mint", { fromBlock: 0 }))
    .then(event => console.log(event));
```

## 台帳IBC1上のBlock高さを確認

IBC0上からIBC1へ向けてPacketを送る際に、Packetがタイムアウトする高さを受信側台帳であるIBC1を基準に指定する必要があります。
そのため、現在のIBC1上でBlockの高さを確認しておきましょう。

```js
await web3.eth.getBlockNumber()
```

## 台帳IBC0上のAliceから台帳IBC1上のBobへトークン転送

IBC1上のBobへMiniTokenを50だけ転送します。
Packetが受信側台帳でタイムアウトする高さとして、1つ前で得たIBC1の高さにPacket中継を行うのに十分な高さを追加します。
例えばIBC1の高さが500だったとして、直後にこの操作を行うのであれば環境にもよりますがここでは1000ほど加えておけば十分すぎるでしょう。

```js
const port = "transfer";
const channel = "channel-0";

const bob = accounts[2];
// あなたの環境に合わせて設定してください
const timeoutHeight = 1500
await MiniToken.deployed()
    .then(instance => instance.sendTransfer(50, bob, port, channel, timeoutHeight, {from: alice}));
```

## 台帳IBC1上のBobから、MiniToken残高を確認

PacketがIBC1側で受信されるのにやや時間がかかりますが、その後、以下のように残高が増えたことを確認できます。

```js
await MiniToken.deployed()
    .then((instance) => instance.balanceOf(bob));
```
