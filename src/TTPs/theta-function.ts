// import { getProviderForNetwork } from "../alert-frameworks/wash-trade-detection/network-config";
// import { Network } from "forta-agent";

// async function sweepDetectionFunction(
//   buyerAddress: string,
//   network: Network
// ): Promise<string | undefined> {
//   const chainId = Number(network);
//   const provider = getProviderForNetwork(chainId);
//   const txs = await provider.getHistory(buyerAddress);

//   if (!txs.length) {
//     // If there is no transaction history, return undefined
//     return undefined;
//   }

//   // Filter out transactions that are outgoing from the buyerAddress
//   const outgoingTxs = txs.filter(
//     (tx) => tx.from === buyerAddress && tx.value.gt(0)
//   );

//   if (!outgoingTxs.length) {
//     // If there are no outgoing transactions, return undefined
//     return undefined;
//   }

//   // Create a mapping of destination addresses and the count of transactions to each
//   const sweepCandidates: Record<string, number> = {};

//   outgoingTxs.forEach((tx) => {
//     if (tx.to) {
//       sweepCandidates[tx.to] = (sweepCandidates[tx.to] || 0) + 1;
//     }
//   });

//   // Find the address with the most transactions (potential sweep address)
//   let maxCount = 0;
//   let sweepAddress: string | undefined = undefined;

//   for (const [address, count] of Object.entries(sweepCandidates)) {
//     if (count > maxCount) {
//       maxCount = count;
//       sweepAddress = address;
//     }
//   }

//   return sweepAddress;
// }

// export { sweepDetectionFunction };
