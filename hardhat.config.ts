/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';

import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    testnet: {
      url: process.env.URL,
      accounts: [process.env.PRIVATE_KEY || ''],
      chainId: 97,
      gasPrice: 20000000000,
    },
  },
};

export default config;
