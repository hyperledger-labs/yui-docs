//const MiniToken = artifacts.require("MiniToken");
const MiniDelegateB1 = artifacts.require("MiniDelegateB1");
const IBCClient = artifacts.require("@hyperledger-labs/yui-ibc-solidity/IBCClient");
const IBCConnection = artifacts.require("@hyperledger-labs/yui-ibc-solidity/IBCConnection");
const IBCChannelHandshake = artifacts.require("@hyperledger-labs/yui-ibc-solidity/IBCChannelHandshake");
const IBCPacket = artifacts.require("@hyperledger-labs/yui-ibc-solidity/IBCPacket");
const IBCHandler = artifacts.require("@hyperledger-labs/yui-ibc-solidity/OwnableIBCHandler");
const MockClient = artifacts.require("@hyperledger-labs/yui-ibc-solidity/MockClient");

const PortTransfer = "transfer"
const MockClientType = "mock-client"

const deployCore = async (deployer) => {
  await deployer.deploy(IBCClient);
  await deployer.deploy(IBCConnection);
  await deployer.deploy(IBCChannelHandshake);
  await deployer.deploy(IBCPacket);
  await deployer.deploy(IBCHandler, IBCClient.address, IBCConnection.address, IBCChannelHandshake.address, IBCPacket.address);

  await deployer.deploy(MockClient, IBCHandler.address);
};

const deployApp = async (deployer) => {
  //await deployer.deploy(MiniToken, IBCHandler.address);
  await deployer.deploy(MiniDelegateB1, IBCHandler.address);
};

const init = async (deployer) => {
  const ibcHandler = await IBCHandler.deployed();

  for(const promise of [
    //() => ibcHandler.bindPort(PortTransfer, MiniToken.address),
    () => ibcHandler.bindPort(PortTransfer, MiniDelegateB1.address),
    () => ibcHandler.registerClient(MockClientType, MockClient.address),
  ]) {
    const result = await promise();
    if(!result.receipt.status) {
      throw new Error(`transaction failed to execute. ${result.tx}`);
    }
  }
}

module.exports = async function(deployer, network) {
  await deployCore(deployer);
  await deployApp(deployer);
  await init(deployer);
};
