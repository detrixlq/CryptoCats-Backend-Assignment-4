// scripts/interact.js
const { ethers } = require("hardhat");

async function main() {
    console.log('Getting the CryptoCats NFT contract...\n');
    const myAddress = '0xe63daF16ABad7c66Dc1a69336970045e086FCF20'
    const contractAddress = '0xFe346A598A763Dd022D25D919154FAE09ed0F377';
    const cryptoCats = await ethers.getContractAt('CryptoCats', contractAddress);
    const signers = await ethers.getSigners();


    console.log('Querying NFT collection name...');
    const name = await cryptoCats.name();
    console.log(`Token Collection Name: ${name}\n`);
    await cryptoCats.mint(myAddress, 0, "ipfs://bafkreigyriw443jtr7awnawfcddpstq4djvquwiktmplyvodaa7bg3mwz4/");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });