const hre = require("hardhat");

async function main() {
  const CryptoCats = await hre.ethers.getContractFactory("CryptoCats");
  const cryptoCats = await CryptoCats.deploy("0xe63daF16ABad7c66Dc1a69336970045e086FCF20");

  await cryptoCats.waitForDeployment();

  console.log("CryptoCats deployed successfully to: ", await cryptoCats.getAddress())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
