import { getProviderForNetwork } from "../agent-config/network-config";
import { Network } from "forta-agent";

//TODO: use alchemy API instead of Etherscan?
async function deltaFunction(
  buyerAddress: string,
  network: Network
): Promise<string | undefined> {
  const chainId = Number(network);
  const provider = getProviderForNetwork(chainId);
  const txs = await provider.getHistory(buyerAddress);
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

export { deltaFunction };
