// rapid movement of funds

export type EOAPath = string[];

type Transaction = {
  from: string;
  to: string;
  timestamp: number;
  receipt_timestamp: number;
};

async function isEOA(address: string, provider: any): Promise<boolean> {
  const code = await provider.getCode(address);
  return code === "0x";
}

export async function trackRapidMovements(
  addr: string,
  provider: any
): Promise<string | null> {
  console.log(`Initiating rapid movement tracking for address: ${addr}`);

  let currentAddress = addr;
  let previousTimestamp: number | null = await getFirstFundingTimestamp(
    currentAddress,
    provider
  );

  if (!previousTimestamp) {
    console.log(`No funding transaction found for ${currentAddress}. Exiting.`);
    return null;
  }

  const outgoingTransaction: Transaction | null =
    await findOutgoingTransactionWithin24HoursFromPrevious(
      currentAddress,
      provider,
      previousTimestamp
    );

  if (!outgoingTransaction) {
    console.log(`No rapid movement found for ${currentAddress}.`);
    return null;
  }

  return outgoingTransaction.to;
}

async function getFirstFundingTimestamp(
  addr: string,
  provider: any
): Promise<number | null> {
  const transactions = await provider.getHistory(addr);
  for (const tx of transactions) {
    if (tx.to.toLowerCase() === addr) {
      // Funding transaction
      return tx.timestamp;
    }
  }
  return null;
}

async function findOutgoingTransactionWithin24HoursFromPrevious(
  addr: string,
  provider: any,
  previousTimestamp: number
): Promise<Transaction | null> {
  console.log(
    `Fetching transactions for ${addr} to find rapid movements from previous transaction time.`
  );

  const transactions = await provider.getHistory(addr);
  for (const tx of transactions) {
    console.log(`Checking transaction from ${tx.from} to ${tx.to}.`);

    if (
      tx.from.toLowerCase() === addr &&
      tx.timestamp - previousTimestamp <= 24 * 60 * 60
    ) {
      console.log(
        `Transaction from ${tx.from} to ${tx.to} is a rapid movement from the previous transaction.`
      );
      if (await isEOA(tx.to, provider)) {
        console.log(`Recipient ${tx.to} is an EOA. Returning transaction.`);
        return tx;
      } else {
        console.log(`Recipient ${tx.to} is not an EOA. Skipping transaction.`);
      }
    }
  }

  console.log(
    `No outgoing transactions within 24 hours of the previous transaction found for ${addr}.`
  );
  return null;
}
