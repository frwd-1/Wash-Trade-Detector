// rapid movement of funds
import { getTransactionHistory } from "../detection-schemas/airdrop-farm-detection/get-txns";

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
  provider: any,
  firstIteration: boolean,
  sweepTimestamp: number
): Promise<Transaction | null> {
  console.log(`Initiating rapid movement tracking for address: ${addr}`);

  let currentAddress = addr;
  let funderTimestamp: number | null;

  if (firstIteration) {
    funderTimestamp = await getFirstFundingTimestamp(currentAddress, provider);
    console.log(`funder timestamp is ${funderTimestamp}`);
  } else {
    funderTimestamp = sweepTimestamp;
    console.log(`funder timestamp is ${funderTimestamp}`);
  }

  const sweepTransaction: Transaction | null =
    await findsweepTransactionWithin24HoursFromfunder(
      currentAddress,
      provider,
      funderTimestamp
    );

  return sweepTransaction;
}

async function getFirstFundingTimestamp(
  addr: string,
  provider: any
): Promise<number | null> {
  const transactions = await getTransactionHistory(addr, provider);
  for (const tx of transactions) {
    if (tx.to.toLowerCase() === addr) {
      console.log(`first funding timestamp is ${tx.timestamp}`);
      return tx.timestamp;
    }
  }
  return null;
}

async function findsweepTransactionWithin24HoursFromfunder(
  addr: string,
  provider: any,
  funderTimestamp: number | null
): Promise<Transaction | null> {
  console.log(
    `Fetching transactions for ${addr} to find rapid movements from funder transaction time.`
  );

  const transactions = await getTransactionHistory(addr, provider);
  for (const tx of transactions) {
    console.log(`Checking transaction from ${tx.from} to ${tx.to}.`);
    const timeDifference = tx.timestamp - funderTimestamp!;
    console.log(
      `time difference is (${timeDifference}) requried to be less than 86400`
    );
    console.log(`addr is ${addr} and tx from is ${tx.from}`);
    if (
      tx.from.toLowerCase() === addr.toLowerCase() &&
      timeDifference <= 24 * 60 * 60 &&
      timeDifference > 0
    ) {
      console.log(
        `Transaction from ${tx.from} to ${tx.to} is a rapid movement from the funder transaction.`
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
    `No sweep transactions within 24 hours of the funder transaction found for ${addr}.`
  );
  return null;
}
