// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

async function main() {

  let name = "Indigg721";
  let symbol = "indigg";
  let tokenURI = "https://gateway.pinata.cloud/ipfs/"
  let receiver = "0x498087B8e184b5CA40449eA279a6cee704665239"
  let feeNumerator ="20"

  const Indigg721 = await hre.ethers.getContractFactory("Indigg721");
  const erc721 = await Indigg721.deploy(name,symbol,tokenURI);
  await erc721.deployed();

  const Indigg1155 = await hre.ethers.getContractFactory("Indigg1155");
  const erc1155 = await Indigg1155.deploy(receiver,feeNumerator,tokenURI);
  await erc1155.deployed();


  console.log(
    `ERC721 contract deployment address`, erc721.address
  );

  console.log(
    `ERC1155 contract deployment address`, erc1155.address
  );


  const ERC721data = {
    address: erc721.address,
    abi: JSON.parse(erc721.interface.format('json'))
  }

  fs.writeFileSync('./config/indigg721.json', JSON.stringify(ERC721data))

  const ERC1155data = {
    address: erc1155.address,
    abi: JSON.parse(erc1155.interface.format('json'))
  }

  fs.writeFileSync('./config/indigg1155.json', JSON.stringify(ERC1155data))

  //Verify the smart contract using hardhat 
  await hre.run("verify:verify", {
    address: "0x4A4e26AaBaD728bb76478D3369b196561a0e5B77",
    constructorArguments: [name,symbol,tokenURI],
  });

  await hre.run("verify:verify", {
    address: "0x052A2c1Aaa5595d51875C223194b50c77A2F440E",
    constructorArguments: [receiver,feeNumerator,tokenURI],
  });

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});