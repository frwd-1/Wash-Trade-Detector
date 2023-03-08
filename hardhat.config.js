require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [
        process.env.SELLER1,
        process.env.BUYER1,
        process.env.BUYER2,
      ],
      chainId: 5,
    },
    localhost: {
      url: "",
      chainId: 31337,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, 
      1: 0, 
    },
  },
  solidity: "0.8.17",
};