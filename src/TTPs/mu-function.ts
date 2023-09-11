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

  console.log(
    `profile for address: ${addr} is complete - funder: ${funder}, sweep: ${sweep}, , interactions: ${Array.from(
      interactions
    )}`
  );
  return Promise.resolve({
    funder,
    sweep,
    interactions: Array.from(interactions),
  });
}
