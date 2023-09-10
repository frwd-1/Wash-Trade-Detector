import { TransactionProfile } from "../../TTPs/mu-function";
import { generateProfile } from "../../TTPs/mu-function";
import { getProviderForNetwork } from "../../agent-config/network-config";
import { calculateSimilarity } from "../../TTPs/nu-function";
import { createOrAddToCluster } from "src/database/cluster-logic";

export async function sequenceDetect(
  addr: string,
  network: any
): Promise<{
  allAddr: Set<string>;
}> {
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
        console.log(`getting profile for ${currentProfile.sweep}`);
        const sweepProfile = await generateProfile(
          currentProfile.sweep,
          await provider.getHistory(currentProfile.sweep!, 0, 99999999),
          provider
        );
        console.log(`notice! addr is ${addr}`);
        console.log(
          `notice! current profile funder is ${currentProfile.funder}`
        );

        const isSimilar = await calculateSimilarity(
          currentProfile,
          sweepProfile
        );
        if (isSimilar) {
          allAddr.add(addr);
          console.log(`added ${addr} to array`);
          addr = currentProfile.sweep;
          console.log(`new addr is ${addr}`);
        } else {
          break;
        }
      }
    } catch (err) {
      console.error("Failed to fetch data from API:", err);
      break;
    }
  }
  //   createOrAddToCluster(String(allAddr), "placeholder")
  return { allAddr };
}
