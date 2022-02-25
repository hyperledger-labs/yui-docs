---
sidebar_position: 1
---

# Overview

This tutorial will take you through building your first IBC application with
[yui-ibc-solidity](https://github.com/hyperledger-labs/yui-ibc-solidity).
We will create a smart contract that allows us to transfer tokens between two ledgers using IBC.

You will learn how to
- Use IBC to create and send packets between blockchains.
- Create a basic token and send tokens to another blockchain.

Here, we will use Solidity to describe the smart contract.
The following ledgers are used:
- Hyperledger Besu
- Ethereum

If you want to know more about IBC, please refer to
[cosmos/ibc](https://github.com/cosmos/ibc)
for more information about IBC.

This tutorial relies on the solidity implementation of IBC provided by
[hyperledger-labs/yui-ibc-solidity](https://github.com/hyperledger-labs/yui-ibc-solidity),
so please refer to its
[README](https://github.com/hyperledger-labs/yui-ibc-solidity#readme)
and its
[docs](https://github.com/hyperledger-labs/yui-ibc-solidity/tree/main/docs)
for the architecture and other information as appropriate.

The code for this tutorial can be downloaded from the following link, so please refer to it accordingly.
- [Contracts](https://github.com/hyperledger-labs/yui-docs/tree/main/contracts/minitoken/solidity)
- [Execution Environment](https://github.com/hyperledger-labs/yui-docs/tree/main/samples/minitoken-besu-ethereum)
