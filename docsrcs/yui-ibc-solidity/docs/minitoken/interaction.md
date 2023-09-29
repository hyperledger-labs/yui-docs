---
sidebar_position: 5
---

# Execute token transfer

For the environment deployed so far,
use `truffle console` to transfer the token to the environment we have just deployed.

The ledger and network names used here are as follows
- IBC0 (network name is `ibc0`)
- IBC1 (network name is `ibc1`)

To run truffle console with the network name, do the following:

```
truffle console --network=<network name>
```

The actors on the ledger are the following for both ledgers
- Alice (`accounts[1]`)
- Bob (`accounts[2]`)

## Initial balances for Alice and Bob

Make sure that the following balances are zero.

- Alice on IBC0
- Bob on IBC1

For each, you can switch the network to connect to and check the following:

```js
// i = 1 for Alice, i = 2 for Bob
MiniToken.deployed()
    .then((instance) => instance.balanceOf(accounts[i]))
```

## Mint to Alice on ledger IBC0

Prepare just 100 MiniTokens on Alice.

```js
const accounts = await web3.eth.getAccounts();
const alice = accounts[1];

await MiniToken.deployed().then(instance => instance.mint(alice, 100));
```

When `mint` succeeds, the `Mint` event will be emitted. To check this, do the following.

```js
MiniToken.deployed()
    .then(instance => instance.getPastEvents("Mint", { fromBlock: 0 }))
    .then(event => console.log(event));
```

## Check the block height on ledger IBC1

When sending a Packet from IBC0 to IBC1, it's necessary to specify the height at which it will timeout based on the receiving ledger IBC1.
Therefore, let's check the current block height on IBC1.

```js
await web3.eth.getBlockNumber()
```

## Transfer token from Alice on ledger IBC0 to Bob on ledger IBC1

Transfer 50 MiniTokens to Bob on IBC1.
For the height at which the Packet will timeout on the receiving ledger, specify a height that adds sufficiently to the one previously obtained for IBC1, ensuring adequate time for Packet relay.
For instance, if the height of IBC1 was 500, considering that this operation will be performed immediately afterward, adding about 1000 should be enough, depending on the environment.

```js
const port = "transfer";
const channel = "channel-0";

const bob = accounts[2];
// Please configure according to your environment
const timeoutHeight = 1500;
await MiniToken.deployed()
    .then(instance => instance.sendTransfer(50, bob, port, channel, timeoutHeight, {from: alice}));
```

## Check the MiniToken balance from Bob on the ledger IBC1.

It will take some time for the Packet to be relayed.
After that, you can see that the balance has increased as shown below.

```js
await MiniToken.deployed()
    .then((instance) => instance.balanceOf(bob));
```
