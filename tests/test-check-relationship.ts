import agent from "../src/agent";

async function main() {
  const buyerAddress = ""; // replace with buyer's address
  const sellerAddresss = ""; // replace with seller's address
  const sender = await agent.findFirstSender(buyerAddress);
  console.log(sender);
  const results = await agent.checkRelationship(buyerAddress, sellerAddresss);
  console.log(results);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
