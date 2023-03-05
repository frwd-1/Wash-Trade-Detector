import agent from "../src/agent"

async function main() {
    // const provider = new ethers.providers.JsonRpcProvider();
    const buyerAddress = "0xd1f322CD8e0F2af195ace36644056e20aa628b06"; // replace with the actual buyer's address
    const sellerAddresss = "0xa4D77537852444C4cB3CE8Df1D5144C65d458088";
    const sender = await agent.findFirstSender(buyerAddress);
    console.log(sender);
    const results = await agent.checkRelationship(buyerAddress, sellerAddresss);
    console.log(results)
  }

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
  });