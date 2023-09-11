// rapid movement of funds
export type EOAPath = string[];

async function isEOA(address: string, provider: any): Promise<boolean> {
  const code = await provider.getCode(address);
  return code === "0x";
}

export async function trackRapidMovements(
  addr: string,
  provider: any,
  depth: number = 10
): Promise<EOAPath> {
  console.log(`Initiating rapid movement tracking for address: ${addr}`);

  const path: EOAPath = [];
  let currentDepth = 0;
  let currentAddress = addr;

  while (currentDepth < depth) {
    const isCurrentAddressEOA = await isEOA(currentAddress, provider);
    console.log(`Is ${currentAddress} an EOA? ${isCurrentAddressEOA}`);

    if (!isCurrentAddressEOA) {
      console.log(`Stopping tracking as ${currentAddress} isn't an EOA.`);
      break;
    }

    path.push(currentAddress);
    console.log(`Added ${currentAddress} to the path.`);

    const outgoingTransaction = await findOutgoingTransactionWithin24Hours(
      currentAddress,
      provider
    );

    if (!outgoingTransaction) {
      console.log(`No rapid movement found for ${currentAddress}.`);
      break;
    }

    currentAddress = outgoingTransaction.to;
    console.log(`Next address to check: ${currentAddress}`);
    currentDepth++;
  }

  console.log(
    `Finished rapid movement tracking for address: ${addr}. Final path: ${JSON.stringify(
      path
    )}`
  );
  return path;
}

async function findOutgoingTransactionWithin24Hours(
  addr: string,
  provider: any
): Promise<any | null> {
  console.log(`Fetching transactions for ${addr} to find rapid movements.`);

  const transactions = await provider.getTransactions(addr);
  for (const tx of transactions) {
    console.log(`Checking transaction from ${tx.from} to ${tx.to}.`);

    if (
      tx.from.toLowerCase() === addr &&
      tx.timestamp - tx.receipt_timestamp <= 24 * 60 * 60
    ) {
      console.log(
        `Transaction from ${tx.from} to ${tx.to} is a rapid movement.`
      );
      if (await isEOA(tx.to, provider)) {
        console.log(`Recipient ${tx.to} is an EOA. Returning transaction.`);
        return tx;
      } else {
        console.log(`Recipient ${tx.to} is not an EOA. Skipping transaction.`);
      }
    }
  }

  console.log(`No outgoing transactions within 24 hours found for ${addr}.`);
  return null;
}
