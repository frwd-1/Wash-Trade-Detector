import { TransactionProfile } from "./mu-function";

export async function calculateSimilarity(
  profile1: TransactionProfile,
  profile2: TransactionProfile
): Promise<boolean> {
  const sortedInteractions1 = [...profile1.interactions].sort();
  const sortedInteractions2 = [...profile2.interactions].sort();
  console.log(
    `Sorted interactions of profile1: ${sortedInteractions1.join(", ")}`
  );
  console.log(
    `Sorted interactions of profile2: ${sortedInteractions2.join(", ")}`
  );

  if (sortedInteractions1.length !== sortedInteractions2.length) {
    return false;
  }

  for (let i = 0; i < sortedInteractions1.length; i++) {
    if (sortedInteractions1[i] !== sortedInteractions2[i]) {
      return false;
    }
  }

  return true;
}
