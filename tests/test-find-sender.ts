import findFirstSender from "../src/agent"

async function main() {
    // const provider = new ethers.providers.JsonRpcProvider();
    const buyerAddress = "0xd1f322CD8e0F2af195ace36644056e20aa628b06"; // replace with the actual buyer's address
    const sender = await findFirstSender.findFirstSender(buyerAddress);
    console.log(sender);
  }

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
  });