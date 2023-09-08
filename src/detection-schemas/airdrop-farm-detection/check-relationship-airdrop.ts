import { getProviderForNetwork } from "../../agent-config/network-config";
import { Network } from "forta-agent";
import { TransactionProfile } from "../../TTPs/mu-function";
import { generateProfile } from "../../TTPs/mu-function";
import { calculateSimilarity } from "../../TTPs/nu-function";
import { Finding } from "forta-agent";
import { detectFarmer } from "../../alerts/airdrop-farmer-found-alert";
import { createOrAddToCluster } from "../../database/cluster-logic";

export async function checkAirdropRelationship(
  origin: string,
  network: Network
): Promise<Finding[]> {
  console.log(`checking relationship`);
  const results: Finding[] = [];
  const chainId = Number(network);
  const provider = getProviderForNetwork(chainId);

  const allAddr: Set<string> = new Set();
  const botCluster: Set<string> = new Set();
  let addr: string = origin;
  let prevAddr: string | null = null;
  let prevProfile: TransactionProfile | null = null;

  while (true) {
    console.log(`starting address is ${addr}`);
    if (allAddr.has(addr)) {
      console.log(`all addr array has address`);
      break;
    }

    allAddr.add(addr);
    console.log(`added ${addr} to array`);

    try {
      const transactions = await provider.getHistory(addr, 0, 99999999);
      transactions.forEach((tx) => {
        console.log(`Transaction Hash: ${tx.hash}`);
      });
      if (!transactions || transactions.length === 0) {
        break;
      }

      const currentProfile = await generateProfile(transactions);
      console.log(`transaction profile is... ${currentProfile}`);
      if (prevProfile) {
        const similarity = await calculateSimilarity(
          prevProfile,
          currentProfile
        );
        if (similarity < 0.1) {
          botCluster.add(prevAddr as string);
          botCluster.add(addr);
        }
      }
      // check relationship
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

  if (allAddr.size > 10) {
    let finding: Finding;
    finding = detectFarmer();
    results.push(finding);
    await createOrAddToCluster(Array.from(allAddr), "placeholder");
  }
  return results;
}
