---
sidebar_position: 4
---

# Deploy contracts

The next step is to deploy contracts.

## Registering MiniToken with IBCHandler

In this tutorial, we use Truffle for deploying contracts.
As usual, deployment of contracts and other migration management is done in the files under `migrations` directory.
For more information about Truffle's migration, please refer to [here](https://www.trufflesuite.com/docs/truffle/getting-started/running-migrations).

Use `IBCHandler.bindPort` to call the appropriate contract according to the receiving port specified in the Packet when IBCHandler receives it.

As shown in `migrations/2_token_migration.js`, after deploying each contract, MiniToken is tied to the `transfer` port.

```js
const PortTransfer = "transfer";
ibcHandler.bindPort(PortTransfer, MiniToken.address);
```

## Setup environment and deploy

You can build the required environment by simply running the following:

```
make setup
```

Specifically, the above command will do the following
- Build the ledger and Relayer
- Start the two ledger networks
- Deploy a Contract to the ledgers
- Start Relayer and execute Handshake between the two ledgers

To exit the environment, execute the following:

```
make down
```
