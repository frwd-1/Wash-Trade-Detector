const { ethers } = require("hardhat")

const TOKEN_ID = 0 // SET THIS BEFORE RUNNING SCRIPT
const PRICE = ethers.utils.parseEther("0.2")

async function relistItem() {
    const accounts = await ethers.getSigners()
    const [deployer, owner, buyer1, buyer2] = accounts

    const IDENTITIES = {
        [deployer.address]: "DEPLOYER",
        [owner.address]: "OWNER",
        [buyer1.address]: "BUYER_1",
        [buyer2.address]: "BUYER_2",
    }
    
    const nftMarketplaceContract = await ethers.getContract("NftMarketplace")
    const basicNftContract = await ethers.getContract("BasicNft")

    console.log("Approving Marketplace as operator of NFT...")
    const approvalTx = await basicNftContract
        .connect(buyer1)
        .approve(nftMarketplaceContract.address, TOKEN_ID)
    await approvalTx.wait(1)

    console.log("Listing NFT...")
    const tx = await nftMarketplaceContract
        .connect(buyer1)
        .listItem(basicNftContract.address, TOKEN_ID, PRICE)
    await tx.wait(1)
    console.log("NFT Listed with token ID: ", TOKEN_ID.toString())

    const listedBy = await basicNftContract.ownerOf(TOKEN_ID)
    console.log(
        `NFT with ID ${TOKEN_ID} listed by owner ${listedBy} with identity ${IDENTITIES[listedBy]}.`
    )

    }

relistItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })