import { BigNumber } from "bignumber.js";

export type TransactionProfile = {
  frequency: number;
  averageValue: BigNumber;
  maxValue: BigNumber;
  minValue: BigNumber;
  inOutRatio: number;
  averageTimeBetween: number; // in seconds
  maxTimeBetween: number;
  minTimeBetween: number;
  averageGasUsed: number;
  uniqueDestinations: number;
};

// TODO: just check funder and sweep addresses only
export function generateProfile(
  transactions: any[]
): Promise<TransactionProfile> {
  let totalValue = new BigNumber(0);
  let maxValue = new BigNumber(0);
  let minValue = new BigNumber(Infinity);
  let incoming = 0;
  let outgoing = 0;
  let totalGasUsed = 0;
  let lastTxTimestamp: number | null = null;
  let maxTimeBetween = 0;
  let minTimeBetween = Infinity;
  let totalTimeInterval = 0;
  let dexInteractions = 0;
  const destinations: Set<string> = new Set();

  for (const tx of transactions) {
    const value = new BigNumber(tx.value);
    totalValue = totalValue.plus(value);
    if (value.gt(maxValue)) maxValue = value;
    if (value.lt(minValue)) minValue = value;

    if (tx.to.toLowerCase() === tx.from.toLowerCase()) outgoing++;
    else incoming++;

    destinations.add(tx.to.toLowerCase());

    totalGasUsed += Number(tx.gasUsed);

    if (lastTxTimestamp !== null) {
      const interval = tx.timestamp - lastTxTimestamp;
      totalTimeInterval += interval;
      if (interval > maxTimeBetween) maxTimeBetween = interval;
      if (interval < minTimeBetween) minTimeBetween = interval;
    }
    lastTxTimestamp = tx.timestamp;
  }

  const avgTimeBetween = totalTimeInterval / (transactions.length - 1 || 1);

  return Promise.resolve({
    frequency: transactions.length,
    averageValue: totalValue.div(transactions.length || 1),
    maxValue,
    minValue,
    inOutRatio: outgoing === 0 ? incoming : incoming / outgoing,
    averageTimeBetween: avgTimeBetween,
    maxTimeBetween,
    minTimeBetween,
    averageGasUsed: totalGasUsed / transactions.length,
    uniqueDestinations: destinations.size,
  });
}
