import { TransactionProfile } from "./mu-function";

export async function calculateSimilarity(
  profile1: TransactionProfile,
  profile2: TransactionProfile
): Promise<number> {
  return Math.abs(profile1.inOutRatio - profile2.inOutRatio);
}
