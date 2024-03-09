const MiniMessage = artifacts.require("MiniMessage");

contract("MiniMessage", (accounts) => {
  it("should have evolved cacnea into cacturne in alice account on ibc0", () =>
  MiniMessage.deployed()
      .then((instance) => instance.balanceOf(accounts[1]))
      .then((mensajin) => {
        assert.equal(mensajin.valueOf(), "alakazam", "cacturne wasn't in Alice account evolved via Invented-delegatecall");
      }));
});
