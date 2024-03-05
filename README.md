# About THIS PROJECT

Project is based on the original proposal made by Hyperledger lab: YUI. A cross-chain solution to allow interopreability between blockchains.

The modifications made here are the following:

- Sending arbitrary data from Blockchain A to Blockchain B
- Automated execution on Blockchain B of the sending function in order to return a data to Blockchain A after being called
- Storage of the Blockchain B data on the Blockchain A once received automatically.
- Use of two Ethereum based blockchains (geth)

This functionalities allow to call from a Blockchain A to a Blockchain B for a data stored exclusively on B and bring it to A without an active member on B sending the information back to A.

# Preparation

Execute `npm install` in the following directories to install dependencies.

- *contracts/minitoken/solidity*
- *samples/minitoken-ethereum-ethereum*

Once installed, first make sure that on:

- *samples/minitoken-ethereum-ethereum/truffle-config.js*

The following variables are written referring to contract_dir as:
`contracts_directory: contract_dir,`
`contracts_build_directory: contract_dir + "/build/contracts",`
`migrations_directory: contract_dir + "/migrations",`

Execute `make setup`

After it, update  *samples/minitoken-ethereum-ethereum/truffle-config.js* changing `contract_dir` for `contract_dir2` on the variables from before.

Execute `make setup2`

# Tests

You can execute the following tests from *samples/minitoken-ethereum-ethereum* to check the functioning of the project:

- `npx truffle exec test/1-send.js --network=ibc0`
- `npx truffle test test/1-send.test.js --network=ibc0 --compile-none --migrate-none`
- `npx truffle test test/2-ibc1.test.js --network=ibc0 --compile-none --migrate-none`


# YUI

"YUI" is japanese word to represent knot, join and connect

# About YUI:

YUI is a lab to achieve interoperability between multiple heterogeneous ledgers. YUI provides modules and middleware for cross-chain communication as well as modules and tools for cross-chain application development, including an explorer to track status and events for cross-chain environments.

For cross-chain communication, the design of YUI is based on Inter Blockchain Communication (IBC) protocol by Cosmos project, with extensions to support various Hyperledger projects.

Modules for cross-chain application development includes one that implements a protocol for atomic operations between ledgers, such as atomic swap of tokens.

## More information

For more information about YUI, you can find here the original project: 
- https://github.com/hyperledger-labs/yui-docs/

### YUI Committers

- Jun Kimura - https://github.com/bluele
- Ryo Sato - https://github.com/3100
- Masanori Yoshida - https://github.com/siburu

### YUI Contributors

Please take a look at [CONTRIBUTORS.md](./CONTRIBUTORS.md)

### YUI Repositories

- https://github.com/hyperledger-labs/yui-fabric-ibc
- https://github.com/hyperledger-labs/yui-ibc-solidity
- https://github.com/hyperledger-labs/yui-corda-ibc
- https://github.com/hyperledger-labs/yui-relayer
