const MiniToken = artifacts.require("MiniToken");
// const IBCHost = artifacts.require("@hyperledger-labs/yui-ibc-solidity/IBCHost");
const IBCClient = artifacts.require("@hyperledger-labs/yui-ibc-solidity/IBCClient");
const IBCConnection = artifacts.require("@hyperledger-labs/yui-ibc-solidity/IBCConnection");
const IBCChannel = artifacts.require("@hyperledger-labs/yui-ibc-solidity/Channel");
const IBCChannelHandshake = artifacts.require("@hyperledger-labs/yui-ibc-solidity/IBCChannelHandshake");
const IBCPacket = artifacts.require("@hyperledger-labs/yui-ibc-solidity/IBCPacket");
const IBCHandler = artifacts.require("@hyperledger-labs/yui-ibc-solidity/OwnableIBCHandler");
const IBCMsgs = artifacts.require("@hyperledger-labs/yui-ibc-solidity/IBCMsgs");
// const IBCIdentifier = artifacts.require("@hyperledger-labs/yui-ibc-solidity/IBCIdentifier");
const MockClient = artifacts.require("@hyperledger-labs/yui-ibc-solidity/MockClient");

const PortTransfer = "transfer"
const MockClientType = "mock-client"

const deployCore = async (deployer) => {
  // await deployer.deploy(IBCIdentifier);
  // await deployer.link(IBCIdentifier, [
  //   IBCHost, IBCHandler,
  //   MockClient
  // ]);

  await deployer.deploy(IBCMsgs);
  await deployer.link(IBCMsgs, [
    IBCClient,
    IBCConnection,
    IBCChannel,
    IBCHandler,
  ]);

  await deployer.deploy(IBCClient);
  await deployer.link(IBCClient, [IBCHandler, IBCConnection, IBCChannel]);

  await deployer.deploy(IBCConnection);
  await deployer.link(IBCConnection, [IBCHandler, IBCChannel]);

  await deployer.deploy(IBCChannel);
  await deployer.link(IBCChannel, [IBCHandler]);

  await deployer.deploy(IBCChannelHandshake);
  await deployer.deploy(IBCPacket);
  await deployer.deploy(IBCHandler, IBCClient.address, IBCConnection.address, IBCChannelHandshake.address, IBCPacket.address);

  await deployer.deploy(MockClient, IBCHandler.address);

  // await deployer.deploy(IBCHost);
  // await deployer.deploy(IBCHandler, IBCHost.address);
};

const deployApp = async (deployer) => {
  // await deployer.deploy(MiniToken, IBCHost.address, IBCHandler.address);
  await deployer.deploy(MiniToken, IBCHandler.address);
};

const init = async (deployer) => {
  // const ibcHost = await IBCHost.deployed();
  const ibcHandler = await IBCHandler.deployed();

  for(const promise of [
    // () => ibcHost.setIBCModule(IBCHandler.address),
    () => ibcHandler.bindPort(PortTransfer, MiniToken.address),
    () => ibcHandler.registerClient(MockClientType, MockClient.address),
  ]) {
    try {
      const result = await promise();
      console.log(result);
      if(!result.receipt.status) {
        throw new Error(`transaction failed to execute. ${result.tx}`);
      }
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = async function(deployer, network) {
  await deployCore(deployer);
  await deployApp(deployer);
  await init(deployer);
};
