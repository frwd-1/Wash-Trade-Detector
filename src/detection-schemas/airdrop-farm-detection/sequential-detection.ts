import { generateProfile } from "../../TTPs/mu-function";
import { getProviderForNetwork } from "../../agent-config/network-config";
import { calculateSimilarity } from "../../TTPs/nu-function";
import { createOrAddToCluster } from "../../database/cluster-logic";
import { trackRapidMovements } from "../../TTPs/sigma-function";
import { getTransactionHistory } from "./get-txns";

export async function sequenceDetect(
  addr: string,
  network: any
): Promise<{ allAddr: Set<string> }> {
  const allAddr: Set<string> = new Set();
  const chainId = Number(network);
  const provider = getProviderForNetwork(chainId);
  let firstIteration: boolean = true;
  let sweepTimestamp: number = 0;
  let firstThreeAddresses: string[] = [];

  while (true) {
    if (allAddr.size > 500) {
      console.log("Reached maximum addresses limit. Exiting loop.");
      break;
    }

    console.log(`Starting address is ${addr}`);
    console.log(`allAddr array contains ${[...allAddr]}`);
    console.log(`allAddr array length is ${allAddr.size}`);
    if (allAddr.has(addr)) {
      console.log(`All addresses array already contains ${addr}`);
    }

    try {
      const transactions = await getTransactionHistory(addr, provider);
      transactions.forEach((tx) => {
        console.log(`Transaction Hash: ${tx.hash}`);
      });

      if (
        !transactions ||
        transactions.length === 0 ||
        transactions.length > 150
      ) {
        break;
      }

      const rapidTransaction = await trackRapidMovements(
        addr,
        provider,
        firstIteration,
        sweepTimestamp
      );

      console.log(`generating current profile for ${addr}`);
      const currentProfile = await generateProfile(
        addr,
        transactions,
        provider
      );
      const sweepProfile = currentProfile.sweep
        ? await generateProfile(
            currentProfile.sweep,
            await getTransactionHistory(currentProfile.sweep!, provider),
            provider
          )
        : null;

      if (sweepProfile) {
        console.log("A sweep profile was found.");
      } else {
        console.log("No sweep profile found.");
      }

      const isSimilar = sweepProfile
        ? await calculateSimilarity(currentProfile, sweepProfile)
        : false;

      if (rapidTransaction && isSimilar) {
        console.log(
          "Both rapid movement and similarity detected. Only considering rapid movement."
        );

        allAddr.add(rapidTransaction.to);
        sweepTimestamp = rapidTransaction.timestamp;
        if (firstIteration) {
          console.log("first iteration, adding starting address to array");
          allAddr.add(addr);
          firstIteration = false;
        }
        addr = rapidTransaction.to;
        continue;
      }

      if (rapidTransaction) {
        console.log("Rapid movement detected");

        allAddr.add(rapidTransaction.to);
        sweepTimestamp = rapidTransaction.timestamp;
        if (firstIteration) {
          console.log("first iteration, adding starting address to array");
          allAddr.add(addr);
          firstIteration = false;
        }
        addr = rapidTransaction.to;
      } else if (isSimilar) {
        console.log("Similarity detected");

        allAddr.add(addr);
        addr = currentProfile.sweep!;
      } else {
        console.log("No rapid movement or similarities detected");
        break;
      }

      // Check if the function returns addresses in the same order as the first 3 addresses
      if (allAddr.size <= 3) {
        firstThreeAddresses = [...allAddr];
      } else if (
        firstThreeAddresses.includes(addr) &&
        firstThreeAddresses.indexOf(addr) < 3
      ) {
        console.log("Detected same order for first 3 addresses. Exiting loop.");
        break;
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
