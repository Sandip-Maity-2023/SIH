const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KisanEscrow Contract", function () {
  let Escrow, escrow, buyer, farmer, inspector;

  beforeEach(async function () {
    [buyer, farmer, inspector] = await ethers.getSigners();
    Escrow = await ethers.getContractFactory("KisanEscrow");
    escrow = await Escrow.deploy(farmer.address, inspector.address);
  });

  it("Should deposit payment and transfer funds to farmer on delivery confirmation", async function () {
    const depositAmount = ethers.parseEther("1.0");

    // Deposit funds from Buyer
    await escrow.connect(buyer).depositPayment({ value: depositAmount });
    expect(await ethers.provider.getBalance(await escrow.getAddress())).to.equal(depositAmount);

    // Track farmer balance before release
    const initialFarmerBalance = await ethers.provider.getBalance(farmer.address);

    // Inspector triggers delivery confirmation
    await escrow.connect(inspector).confirmDelivery();

    // Check farmer received payment
    const finalFarmerBalance = await ethers.provider.getBalance(farmer.address);
    expect(finalFarmerBalance - initialFarmerBalance).to.equal(depositAmount);
  });
});
