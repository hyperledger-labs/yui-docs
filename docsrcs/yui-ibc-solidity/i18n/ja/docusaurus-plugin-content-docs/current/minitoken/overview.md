---
sidebar_position: 1
---

# 概要

このチュートリアルでは、
[yui-ibc-solidity](https://github.com/hyperledger-labs/yui-ibc-solidity)
を用いて、初めてのIBCアプリケーションを構築するプロセスを紹介します。
チュートリアル執筆時点では
[v0.3.3](https://github.com/hyperledger-labs/yui-ibc-solidity/tree/v0.3.3)
を用いています。

IBCを使って2つの台帳間でトークンを転送できるスマートコントラクトを作成します。

以下の方法を学びます。
- IBCを使って、ブロックチェーン間でパケットを作成・送信する
- 基本的なトークンを作成し、トークンを別のブロックチェーンに送信する

ここでは、Solidityを使ってスマートコントラクトを説明します。
また、以下の台帳を用います。
- Hyperledger Besu
- Ethereum

IBCについて詳しく知りたい方は
[cosmos/ibc](https://github.com/cosmos/ibc)
を参照してください。

また、このチュートリアルは[hyperledger-labs/yui-ibc-solidity](https://github.com/hyperledger-labs/yui-ibc-solidity)
が提供するIBCのSolidity実装に依存していますので、適宜
[README](https://github.com/hyperledger-labs/yui-ibc-solidity#readme)や、アーキテクチャやその他の情報について
[docs](https://github.com/hyperledger-labs/yui-ibc-solidity/tree/main/docs)
を参照ください。

尚、このチュートリアルのコードは以下から入手できますので、適宜参照してください。
- [コントラクト](https://github.com/hyperledger-labs/yui-docs/tree/main/contracts/minitoken/solidity)
- [実行環境](https://github.com/hyperledger-labs/yui-docs/tree/main/samples/minitoken-besu-ethereum)
