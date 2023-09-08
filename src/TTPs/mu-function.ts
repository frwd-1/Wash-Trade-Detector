import { BigNumber } from "bignumber.js";

export type TransactionProfile = {
  funder?: string;
  sweep?: string;
  isFirstFunder: boolean;
  interactions: string[];
};

export async function generateProfile(
  addr: string,
  transactions: any[]
): Promise<TransactionProfile> {
  // ... existing code ...

  let funder: string | undefined;
  let sweep: string | undefined;
  let isFirstFunder = false;
  const interactions: Set<string> = new Set();

  for (const tx of transactions) {
    // ... existing code ...

    if (!funder && tx.to.toLowerCase() === addr) {
      funder = tx.from.toLowerCase();
    }

    if (!sweep && tx.from.toLowerCase() === addr) {
      sweep = tx.to.toLowerCase();
    }

    if (sweep && tx.to.toLowerCase() === sweep && !tx.value) {
      isFirstFunder = true;
    }

    if (tx.to.toLowerCase() !== funder && tx.to.toLowerCase() !== sweep) {
      interactions.add(tx.to.toLowerCase());
    }
  }

  return Promise.resolve({
    funder,
    sweep,
    isFirstFunder,
    interactions: Array.from(interactions),
    // ... rest of the properties ...
  });
}
