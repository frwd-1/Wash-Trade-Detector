const MAX_CACHE_SIZE = 10;
const transactionCache: Map<string, any[]> = new Map();

function ensureCacheLimit() {
  while (transactionCache.size > MAX_CACHE_SIZE) {
    // Delete the oldest entry (Map maintains insertion order)
    const oldestKey = transactionCache.keys().next().value;
    transactionCache.delete(oldestKey);
  }
}

export async function getTransactionHistory(
  addr: string,
  provider: any
): Promise<any[]> {
  if (transactionCache.has(addr)) {
    return transactionCache.get(addr)!;
  } else {
    const transactions = await provider.getHistory(addr, 0, 99999999);

    ensureCacheLimit();

    transactionCache.set(addr, transactions);
    return transactions;
  }
}
