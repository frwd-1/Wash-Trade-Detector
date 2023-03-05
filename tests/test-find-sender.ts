import agent from "../src/agent";

async function main() {
  const buyerAddress = ""; // replace with the buyer's address
  const sender = await agent.findFirstSender(buyerAddress);
  console.log(sender);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
