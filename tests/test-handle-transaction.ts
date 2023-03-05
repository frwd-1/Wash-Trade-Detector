import agent from "../src/agent";
import { ethers } from "ethers";
import {
  EventType,
  Network,
  TransactionEvent,
  TxEventBlock,
} from "forta-agent";

async function main() {
  // test transaction event
  const tx = new TransactionEvent(
    EventType.BLOCK,
    Network.GOERLI,
    {
      hash: "",
      from: "",
      to: "",
      nonce: 0,
      gas: "",
      gasPrice: "",
      value: "",
      data: "",
      r: "",
      s: "",
      v: "",
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
