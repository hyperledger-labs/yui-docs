---
sidebar_position: 4
---

# Contractのデプロイ

続いて、Contractをデプロイしていきます。

## IBCHandlerへのMiniTokenの登録

このチュートリアルではContractのデプロイにTruffleを用いています。
通常通り、Contractのデプロイなどマイグレーション管理は`migrations`ディレクトリ下のファイルで行います。
Truffleのmigrationに関しては[こちら](https://www.trufflesuite.com/docs/truffle/getting-started/running-migrations)
を参照してください。

IBCHandlerがPacketを受け取った際に、Packetで指定された受取側Portに合わせて適切なContractを呼び出すには
`IBCHandler.bindPort`を用います。

`migrations/2_token_migration.js`にあるように、
各Contractのデプロイ後、MiniTokenを`transfer` Portと紐付けています。

```js
const PortTransfer = "transfer";
ibcHandler.bindPort(PortTransfer, MiniToken.address);
```

## 環境の構築とデプロイ

ここでは、単に以下を実行することで、必要な環境を構築します。

```
make setup
```

具体的には、上のコマンドは以下の処理を行います。
- 台帳やRelayerのビルド
- 2つの台帳ネットワークを起動
- 台帳に対してContractをデプロイ
- Relayerを起動し、2台帳間のHandshakeを実施

環境を終了するには、以下を実行してください。

```
make down
```
