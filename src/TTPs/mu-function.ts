const profileCache: Map<string, TransactionProfile> = new Map();
const profileOrder: string[] = []; // This array tracks the order of profile additions
const MAX_CACHE_SIZE = 10;

export type TransactionProfile = {
  funder?: string;
  sweep?: string;
  interactions: string[];
};

async function isEOA(address: string, provider: any): Promise<boolean> {
  const code = await provider.getCode(address);
  return code === "0x";
}

export async function generateProfile(
  addr: string,
  transactions: any[],
  provider: any
): Promise<TransactionProfile> {
  // Check if the profile for the address exists in the cache
  if (profileCache.has(addr)) {
    console.log(`Returning cached profile for address ${addr}`);
    return profileCache.get(addr)!;
  }

  let funder: string | undefined;
  let sweep: string | undefined;
  const interactions: Set<string> = new Set();

  let foundFunder = false;
  let foundSweep = false;

  for (const tx of transactions) {
    // If we've found both funder and sweep, stop processing
    if (foundFunder && foundSweep) break;

    // 1. Find the Funder
    if (!foundFunder && tx.to.toLowerCase() === addr) {
      const isAddressEOA = await isEOA(tx.from, provider);
      if (isAddressEOA) {
        console.log(`funder found! funder is ${tx.from}`);
        funder = tx.from.toLowerCase();
        foundFunder = true;
      }
    }

    // 2. Find Interactions
    if (foundFunder && !foundSweep) {
      if (tx.from.toLowerCase() === addr && tx.to.toLowerCase() !== funder) {
        const isRecipientEOA = await isEOA(tx.to, provider);
        if (isRecipientEOA) {
          console.log(`sweep is ${tx.to}`);
          sweep = tx.to.toLowerCase();
          foundSweep = true;
        } else {
          console.log(`interaction found: ${tx.to}`);
          interactions.add(tx.to.toLowerCase());
        }
      }
    }
  }

  const generatedProfile = {
    funder,
    sweep,
    interactions: Array.from(interactions),
  };

  // Save the generated profile to cache
  profileCache.set(addr, generatedProfile);
  profileOrder.push(addr); // Track the order of profile additions

  // Check cache size
  if (profileOrder.length > MAX_CACHE_SIZE) {
    // Delete the oldest profile from the cache
    const oldestAddr = profileOrder.shift();
    if (oldestAddr) {
      profileCache.delete(oldestAddr);
    }
  }

  console.log(
    `profile for address: ${addr} is complete - funder: ${funder}, sweep: ${sweep}, interactions: ${Array.from(
      interactions
    )}`
  );

  return generatedProfile;
}
