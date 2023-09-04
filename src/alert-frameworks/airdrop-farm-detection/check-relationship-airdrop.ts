import { getProviderForNetwork } from "src/network-config";
import { Network } from "forta-agent";
import { TransactionProfile } from "src/TTPs/mu-function";
import { generateProfile } from "src/TTPs/mu-function";
import { calculateSimilarity } from "src/TTPs/nu-function";

export async function traceTokenTransfer(
  origin: string,
  network: Network
): Promise<string[]> {
  const chainId = Number(network);
  const provider = getProviderForNetwork(chainId);

  const allAddr: Set<string> = new Set();
  const botCluster: Set<string> = new Set();
  let addr: string = origin;
  let prevAddr: string | null = null;
  let prevProfile: TransactionProfile | null = null;

  while (true) {
    console.log(addr);
    if (allAddr.has(addr)) {
      break;
    }

    allAddr.add(addr);

    try {
      const transactions = await provider.getHistory(addr, 0, 99999999);

      if (!transactions || transactions.length === 0) {
        break;
      }

      const currentProfile = generateProfile(transactions);

      if (prevProfile) {
        const similarity = calculateSimilarity(prevProfile, currentProfile);
        if (similarity < 0.1) {
          // You can adjust this threshold as needed
          botCluster.add(prevAddr as string);
          botCluster.add(addr);
        }
      }

      prevProfile = currentProfile;
      prevAddr = addr;

      if (transactions[0].to) {
        addr = transactions[0].to;
      } else {
        console.warn("Unexpected transaction format: Missing 'to' address");
        break;
      }
    } catch (err) {
      console.error("Failed to fetch data from API:", err);
      break;
    }
  }

  // add code to store the botCluster addresses in database.

  return Array.from(allAddr);
}
