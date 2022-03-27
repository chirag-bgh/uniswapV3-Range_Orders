require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan")
require('dotenv').config()
const PrivateKey = process.env.PRIVATE_KEY;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.6",
  networks: {
    kovan: {
      url: "https://kovan.infura.io/v3/609bf3e77ede4b2980e3998956e6876b",
      accounts: [`0x${PrivateKey}`]
    }
  },
  mocha: {
    timeout: 1000 * 10000
  },
  etherscan: {
    apiKey: {
      kovan: "NSXM4E486FHRDEVDY57CWE4ZM1G2QIGHPZ"
    }
  }
};
