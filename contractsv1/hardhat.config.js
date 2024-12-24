require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@matterlabs/hardhat-zksync");
require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-verify");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  zksolc: {
    version: "latest",
    settings: {},
  },
  networks: {
    // ...

    lensTestnet: {
      chainId: 37111,
      ethNetwork: "sepolia",
      url: "https://rpc.testnet.lens.dev",
      verifyURL:
        "https://block-explorer-verify.testnet.lens.dev/contract_verification",
      zksync: true,
      accounts: [`0x7f305a127c3ef0fc01ade48d279ff75b26bf1c70b102da7e0ce096cd9b3a3d74`]
    },

    hardhat: {
      zksync: true,
    },
  },
};
