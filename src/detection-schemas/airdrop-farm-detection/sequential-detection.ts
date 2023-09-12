import { generateProfile } from "../../TTPs/mu-function";
import { getProviderForNetwork } from "../../agent-config/network-config";
import { calculateSimilarity } from "../../TTPs/nu-function";
import { createOrAddToCluster } from "../../database/cluster-logic";
import { trackRapidMovements } from "../../TTPs/sigma-function";

export async function sequenceDetect(
  addr: string,
  network: any
): Promise<{ allAddr: Set<string> }> {
  const allAddr: Set<string> = new Set();
  const chainId = Number(network);
  const provider = getProviderForNetwork(chainId);
  let firstIteration: boolean = true;
  let sweepTimestamp: number = 0;

  while (true) {
    console.log(`Starting address is ${addr}`);
    if (allAddr.has(addr)) {
      console.log(`All addresses array already contains ${addr}`);
      //   break;
    }

    try {
      const transactions = await provider.getHistory(addr, 0, 99999999);
      transactions.forEach((tx) => {
        console.log(`Transaction Hash: ${tx.hash}`);
      });
      if (!transactions || transactions.length === 0) {
        break;
      }

      console.log(`Checking rapid movements`);
      const rapidTransaction = await trackRapidMovements(
        addr,
        provider,
        firstIteration,
        sweepTimestamp
      );

      if (rapidTransaction) {
        allAddr.add(rapidTransaction.to);
        sweepTimestamp = rapidTransaction.timestamp;
        if (firstIteration) {
          console.log("first iteration, adding starting address to array");
          allAddr.add(addr);
          firstIteration = false;
        }
        addr = rapidTransaction.to; // Use the new found address for the next iteration.
        continue;
      }

      console.log("getting profiles");
      const currentProfile = await generateProfile(
        addr,
        transactions,
        provider
      );
      console.log(`transaction profile is... ${currentProfile}`);

      if (currentProfile.sweep) {
        const sweepProfile = await generateProfile(
          currentProfile.sweep,
          await provider.getHistory(currentProfile.sweep!, 0, 99999999),
          provider
        );

        const isSimilar = await calculateSimilarity(
          currentProfile,
          sweepProfile
        );

        if (isSimilar) {
          allAddr.add(addr);
          addr = currentProfile.sweep;
        }
      }
    } catch (err) {
      console.error("Failed to fetch data from API:", err);
      break;
    }
  }

  const allAddrArray = Array.from(allAddr);
  const currentDateTime = new Date().toISOString();

  if (allAddr.size > 10) {
    const clusterId = await createOrAddToCluster(allAddrArray, currentDateTime);
    console.log(`Addresses added to cluster with ID: ${clusterId}`);
  } else {
    console.log("The set has 10 or fewer addresses. Not adding to cluster.");
  }

  return { allAddr };
}
