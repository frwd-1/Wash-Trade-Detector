import {
  ethProvider,
  avaxProvider,
  ftmProvider,
  optProvider,
  mtcProvider,
  bscProvider,
  arbProvider,
} from "./constants";
import { Network } from "forta-agent";

async function findFirstSender(
  buyerAddress: string,
  network: Network
): Promise<string | undefined> {
  // const confirmNetwork = Number(network);
  console.log(`confirm network is ${network}`);

  console.log(`network (typeof): ${typeof network}`);
  const chainId = Number(network);
  console.log(`chainId (typeof): ${typeof chainId}`);
  console.log(chainId);

  let txs;
  switch (chainId) {
    case 1: // Ethereum Mainnet
      txs = await ethProvider.getHistory(buyerAddress);
      break;
    case 43114: // Avalanche
      txs = await avaxProvider.getHistory(buyerAddress);
      break;
    case 250: // Fantom
      txs = await ftmProvider.getHistory(buyerAddress);
      break;
    case 10: // Optimism
      txs = await optProvider.getHistory(buyerAddress);
      break;
    case 137: // Polygon
      txs = await mtcProvider.getHistory(buyerAddress);
      break;
    case 56: // BSC
      txs = await bscProvider.getHistory(buyerAddress);
      break;
    case 42161: // Arbitrum
      txs = await arbProvider.getHistory(buyerAddress);
      break;
    default:
      throw new Error(`Unsupported network ID: ${network}`);
  }

  if (!txs.length) {
    // If there is no transaction history, return undefined
    return undefined;
  }

  // Sorts the buyer transaction history by block number, ascending order
  txs.sort((a, b) => {
    if (a.blockNumber === undefined || b.blockNumber === undefined) {
      return 0;
    }
    return a.blockNumber - b.blockNumber;
  });

  // Find the first transaction that transferred funds to the buyer wallet
  const fundedBy = txs.find((tx) => tx.to === buyerAddress && tx.value.gt(0));

  if (!fundedBy) {
    // If no transaction transferred funds to the buyer, return undefined
    return undefined;
  }

  // Get the sender's address
  const sender = fundedBy.from;

  return sender;
}

export { findFirstSender };
