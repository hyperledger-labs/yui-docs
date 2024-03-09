/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic =
  "math razor capable expose worth grape metal sunset metal sudden usage scheme";
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

const contract_dir = "./../../contracts/minitoken/solidity";
const contract_dir2 = "./../../contracts/minitoken/solidityB2";


module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */
  contracts_directory: contract_dir2,
  contracts_build_directory: contract_dir2 + "/build/contracts",
  migrations_directory: contract_dir2 + "/migrations",

  networks: {
    ibc0: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8645, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
      networkCheckTimeout: 10000,
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic,
          },
          providerOrUrl: "http://localhost:8645",
          addressIndex: 0,
          numberOfAddresses: 10,
          pollingInterval: 8000, // Reducing socket hang up error
        }),
    },
    ibc1: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8745, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
      provider: () =>
        new HDWalletProvider(mnemonic, "http://localhost:8745", 0, 10),
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.9", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 1000,
        },
        //  evmVersion: "byzantium"
      },
    },
  }
};
