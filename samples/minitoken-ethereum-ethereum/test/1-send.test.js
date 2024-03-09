const MiniMessage = artifacts.require("MiniMessage");

contract("MiniMessage", (accounts) => {
  it("should cacneacall el cacnea", async () => {
    const block = await web3.eth.getBlockNumber();
    MiniMessage.deployed()
      .then((instance) =>
        instance.getPastEvents("Cacneacall", {
          
          fromBlock: block,
        })
      )
      .then((evt) => {
        assert.equal(
          evt[0].args.amount.valueOf(),
          "",
          "cacnea wasn't burnt from Alice account"
        );
      });
  });
});
