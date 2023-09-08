import { TransactionProfile } from "../../TTPs/mu-function";
import { generateProfile } from "../../TTPs/mu-function";
import { getProviderForNetwork } from "../../agent-config/network-config";

export async function sequenceDetect(
  addr: string,
  network: any
): Promise<{
  allAddr: Set<string>;
  botCluster: Set<string>;
  prevProfile: TransactionProfile | null;
}> {
  const allAddr: Set<string> = new Set();
  const botCluster: Set<string> = new Set();
  let prevAddr: string | null = null;
  let prevProfile: TransactionProfile | null = null;

  const chainId = Number(network);
  const provider = getProviderForNetwork(chainId);

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

      const currentProfile = await generateProfile(addr, transactions);
      console.log(`transaction profile is... ${currentProfile}`);
      if (currentProfile.isFirstFunder && prevProfile) {
        const sweepProfile = await generateProfile(
          addr,
          await provider.getHistory(currentProfile.sweep!, 0, 99999999)
        );

        if (
          JSON.stringify(currentProfile.interactions) ===
          JSON.stringify(sweepProfile.interactions)
        ) {
          //   addToDatabase(currentProfile, sweepProfile); // Placeholder function
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

  return { allAddr, botCluster, prevProfile };
}
