import agent from "../src/agent";
import { ethers } from "ethers";
import {
  EventType,
  Network,
  TransactionEvent,
  TxEventBlock,
} from "forta-agent";

// const provider = new ethers.providers.AlchemyProvider(process.env.GOERLI_RPC_URL);

async function main() {
  // const txHash = "0x172c781eeabf4b2529384b867c0de76a6f415a690ec79e930eb79899dc51db27";

  // const tx = await provider.getTransaction(txHash);
  const tx = new TransactionEvent(
    EventType.BLOCK,
    Network.GOERLI,
    {
      hash: "0x172c781eeabf4b2529384b867c0de76a6f415a690ec79e930eb79899dc51db27",
      from: "0xa4D77537852444C4cB3CE8Df1D5144C65d458088",
      to: "0xd1f322CD8e0F2af195ace36644056e20aa628b06",
      nonce: 0,
      gas: "1000",
      gasPrice: "1000",
      value: "0",
      data: "0x9f37092a000000000000000000000000a0aa720a441e62b0beeda2db452cb728e9aea6b10000000000000000000000000000000000000000000000000000000000000000",
      r: "string",
      s: "string",
      v: "string",
    },
    [],
    { address: true },
    { hash: "hash", number: 0, timestamp: 0 },
    [],
    null
  );

  const findings = await agent.handleTransaction(tx);
  console.log(findings);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
