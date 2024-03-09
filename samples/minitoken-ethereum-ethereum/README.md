minitoken
---

This is an example of an application using IBC to transfer [MiniToken](/contracts/minitoken/solidity) placed on two ledgers.

We use the following ledgers specifically:
- Hyperledger Besu
- Ethereum

# Preparation

Execute `npm install` in the following directory.

- contracts/minitoken/solidity
- samples/minitoken-besu-ethereum

# Setup

The following will start the ledger, deploy the contract, and establish the channel with a relayer:

```
make setup
```

If you want to do each setup independently, see [Makefile](/samples/minitoken/Makefile)
for more information.

# E2E

Perform E2E test to transfer MiniToken between ledgers:

```
make e2e
```

# Clean Up

Stop the ledger and Relayer:

```
make down
```
