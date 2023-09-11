import { TransactionProfile } from "../../TTPs/mu-function";
import { generateProfile } from "../../TTPs/mu-function";
import { getProviderForNetwork } from "../../agent-config/network-config";
import { calculateSimilarity } from "../../TTPs/nu-function";
import { createOrAddToCluster } from "src/database/cluster-logic";
import { trackRapidMovements } from "src/TTPs/sigma-function";

export async function sequenceDetect(
  addr: string,
  network: any
): Promise<{ allAddr: Set<string> }> {
  const allAddr: Set<string> = new Set();
  const chainId = Number(network);
  const provider = getProviderForNetwork(chainId);

  while (true) {
    console.log(`starting address is ${addr}`);
    if (allAddr.has(addr)) {
      console.log(`all addr array has address`);
      break;
    }

    try {
      const transactions = await provider.getHistory(addr, 0, 99999999);
      transactions.forEach((tx) => {
        console.log(`Transaction Hash: ${tx.hash}`);
      });
      if (!transactions || transactions.length === 0) {
        break;
      }

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

      console.log(`checking sigmas`);
      const rapidAddresses = await trackRapidMovements(addr, provider);

      if (rapidAddresses.length > 0) {
        rapidAddresses.forEach((address) => allAddr.add(address));
        addr = rapidAddresses[rapidAddresses.length - 1]; // Use the last address in the rapid movement path for the next iteration.
      }
    } catch (err) {
      console.error("Failed to fetch data from API:", err);
      break;
    }
  }

  const allAddrArray = Array.from(allAddr);
  const currentDateTime = new Date().toISOString();

  const clusterId = await createOrAddToCluster(allAddrArray, currentDateTime);
  console.log(`Addresses added to cluster with ID: ${clusterId}`);
  return { allAddr };
}
