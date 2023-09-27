const MiniToken = artifacts.require("MiniToken");

module.exports = async (callback) => {
  const accounts = await web3.eth.getAccounts();
  const alice = accounts[1];
  const bob = accounts[2];

  const sendAmount = 50;
  const port = "transfer";
  const channel = "channel-0";
  const timeoutHeight = 10000000;

  const miniToken = await MiniToken.deployed();
  const result = await miniToken.sendTransfer(sendAmount, bob, port, channel, timeoutHeight, {
    from: alice,
  });
  console.log(result)
  const sendTransfer = await miniToken.getPastEvents("SendTransfer", {
    fromBlock: 0,
  });
  console.log(sendTransfer);

  callback();
};
