// Import the necessary libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoCats Contract", function () {
  let CryptoCats, cryptoCats, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploy the contract before each test
    CryptoCats = await ethers.getContractFactory("CryptoCats");
    [owner, addr1, addr2] = await ethers.getSigners();
    cryptoCats = await CryptoCats.deploy(owner.address);
    await cryptoCats.waitForDeployment();
  });

  describe("Minting", function () {
    it("Should mint a new CryptoCat by the owner", async function () {
      await cryptoCats.mint(addr1.address, 1, "ipfs://example");
      expect(await cryptoCats.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should fail to mint a new CryptoCat by a non-owner", async function () {
      await expect(cryptoCats.connect(addr1).mint(addr2.address, 2, "ipfs://example2"))
      .to.be.revertedWithCustomError(cryptoCats, "OwnableUnauthorizedAccount");
    });
  });

  describe("Transferring", function () {
    beforeEach(async function () {
      await cryptoCats.mint(addr1.address, 1, "ipfs://example");
    });

    it("Should safely transfer a CryptoCat from one address to another by the owner", async function () {
      await cryptoCats.connect(addr1)["safeTransferFrom(address,address,uint256)"]
      (addr1.address, addr2.address, 1, ethers.randomBytes(0));
      expect(await cryptoCats.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should fail to transfer a CryptoCat by a non-owner", async function () {
      await expect(cryptoCats["safeTransferFrom(address,address,uint256)"]
      (addr1.address, addr2.address, 1, ethers.randomBytes(0))).to.be.revertedWith("Caller is not owner nor approved");
    });

    it("Should prevent transferring a CryptoCat to the zero address", async function () {
      await cryptoCats.mint(addr1.address, 3, "ipfs://example");
      await expect(cryptoCats.connect(addr1)["safeTransferFrom(address,address,uint256)"]
      (addr1.address, "0x0000000000000000000000000000000000000000", 3, ethers.randomBytes(0)))
      .to.be.revertedWithCustomError(cryptoCats, "ERC721InvalidReceiver");
    });
    
    
  });

  describe("Approvals", function () {
    beforeEach(async function () {
      await cryptoCats.mint(addr1.address, 1, "ipfs://example");
    });

    it("Should set an approval for a CryptoCat", async function () {
      await cryptoCats.connect(addr1).approve(addr2.address, 1);
      expect(await cryptoCats.getApproved(1)).to.equal(addr2.address);
    });

    it("Should set an operator for all tokens of an owner", async function () {
      await cryptoCats.connect(addr1).setApprovalForAll(addr2.address, true);
      expect(await cryptoCats.isApprovedForAll(addr1.address, addr2.address)).to.be.true;
    });
  });

  describe("Token URI", function () {
    it("Should return the correct token URI for a minted CryptoCat", async function () {
      const uri = "ipfs://example";
      await cryptoCats.mint(addr1.address, 1, uri);
      expect(await cryptoCats.tokenURI(1)).to.equal(uri);
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      await cryptoCats.mint(addr1.address, 1, "ipfs://example");
    });

    it("Should burn a CryptoCat and ensure it no longer exists", async function () {
      await cryptoCats.connect(addr1).approve(owner.address, 1);
      await cryptoCats.burn(1);
      await expect(cryptoCats.ownerOf(1)).to.be.revertedWithCustomError(cryptoCats, "ERC721NonexistentToken");
    });
  });
});
