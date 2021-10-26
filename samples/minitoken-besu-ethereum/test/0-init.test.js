const MiniToken = artifacts.require("MiniToken");

contract("MiniToken", (accounts) => {
  it("should put 100 MiniToken in Alice account on ibc0", () =>
    MiniToken.deployed()
      .then((instance) => instance.balanceOf(accounts[1]))
      .then((balance) => {
        assert.equal(balance.valueOf(), 100, "100 wasn't in Alice account");
      }));
});
