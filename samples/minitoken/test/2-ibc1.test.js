const MiniToken = artifacts.require("MiniToken");

contract("MiniToken", (accounts) => {
  it("should put 50 MiniToken in bob account on ibc1", () =>
    MiniToken.deployed()
      .then((instance) => instance.balanceOf(accounts[2]))
      .then((balance) => {
        assert.equal(balance.valueOf(), 50, "50 wasn't in Bob account");
      }));
});
