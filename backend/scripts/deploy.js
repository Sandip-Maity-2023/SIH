import hre from "hardhat";

async function main() {
  const [buyer, farmer, inspector] = await hre.ethers.getSigners();

  console.log("Deploying contract with Buyer account:", buyer.address);

  const KisanEscrow = await hre.ethers.getContractFactory("KisanEscrow");
  const escrow = await KisanEscrow.deploy(farmer.address, inspector.address);

  await escrow.waitForDeployment();
  const address = await escrow.getAddress();

  console.log(`KisanEscrow contract deployed to: ${address}`);
  console.log(`Farmer: ${farmer.address}`);
  console.log(`Inspector: ${inspector.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});