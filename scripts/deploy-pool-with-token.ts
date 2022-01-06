/* eslint-disable prettier/prettier */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// eslint-disable-next-line prettier/prettier
import { ethers } from 'hardhat';

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // eslint-disable-next-line prettier/prettier
  const UtilityToken = await ethers.getContractFactory('UtilityToken');
  const factory = await (
    await ethers.getContractFactory('Factory')
  ).attach('0x6725F303b657a9451d8BA641348b6761A6CC7a17');

  const router = await (
    await ethers.getContractFactory('Router')
  ).attach('0xD99D1c33F9fC3444f8101754aBC46c52416550D1');

  const wrappedBnb = await (
    await ethers.getContractFactory('UtilityToken')
  ).attach('0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd');

  // eslint-disable-next-line prettier/prettier
  const utilityToken = await UtilityToken.deploy('tokenA', 'TKA', 1000000000);

  await utilityToken.deployed();

  const pairAddress = await factory.createPair(
    utilityToken.address,
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd'
  );

  console.log({ router: router.address });

  const approvedA = await utilityToken.approve(router.address, 10000);

  const approvedB = await wrappedBnb.approve(
    router.address,
    ethers.utils.parseUnits('0.01', 'ether')
  );

  console.log({ approvedA: approvedA.hash, approvedB: approvedB.hash });
  console.log({ pairAddress: pairAddress.hash });

  const transaction = await router.addLiquidity(
    utilityToken.address,
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    10000,
    ethers.utils.parseUnits('0.01', 'ether'),
    10000,
    ethers.utils.parseUnits('0.01', 'ether'),
    utilityToken.address,
    Math.floor(Date.now() / 1000) + 60 * 10,
    {
      gasPrice: ethers.utils.parseUnits('5', 'gwei'),
      gasLimit: 2500000,
    }
  );

  // const pair = await await (
  //   await ethers.getContractFactory('Pair')
  // ).attach(pairAddress);

  // const balance = await pair.balanceOf(admin);
  // console.log(`balance LP: ${balance.toString()}`);

  // eslint-disable-next-line prettier/prettier

  console.log(`Token deployed at address: ', ${utilityToken.address}
               At Address https://testnet.bscscan.com/address/${utilityToken.address}
               liquidity added at address: https://testnet.bscscan.com/tx/${transaction.hash}
               `);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
