import {
  Finding,
  LogDescription,
  Network,
  TransactionEvent,
} from "forta-agent";
import {
  getBuyer,
  getSeller,
  getNftId,
  getNftContractAddress,
  getTimestamp,
  getDateTime,
  getExchangeAddress,
} from "./utils";
import { deltaFunction } from "../../TTPs/delta-function";
import { betaFunction } from "../../TTPs/beta-function";
import { addTxToDatabase } from "../../database/db-utils";
import { createOrAddToCluster } from "../../database/cluster-logic";
import {
  addSybilWallet,
  addSybilAsset,
  addSybilProtocol,
} from "../../database/risk-logic";
import { detectEdge } from "./alerts/edge-detected-alert";
import { detectCluster } from "./alerts/cluster-detected-alert";

let numberOfTrades: number = 0;
let numberOfWashTrades: number = 0;

async function checkRelationship(
  txEvent: TransactionEvent,
  transfer: LogDescription,
  network: Network
): Promise<Finding[]> {
  const results: Finding[] = [];

  async function countTrades(): Promise<void> {
    numberOfTrades++;
  }

  async function countWashTrades(): Promise<void> {
    numberOfWashTrades++;
  }

  countTrades();

  const buyer = getBuyer(transfer);
  const seller = getSeller(transfer);

  const tokenId = getNftId(transfer);

  const nftContractAddress = getNftContractAddress(transfer);

  const timestamp = getTimestamp(txEvent);

  const dateTime = getDateTime(timestamp);

  const exchangeAddress = getExchangeAddress(txEvent);

  const bob = await deltaFunction(buyer, network);

  if (bob) {
    countWashTrades();

    let finding: Finding;

    if (bob === seller) {
      finding = detectCluster(
        seller,
        buyer,
        exchangeAddress,
        tokenId,
        numberOfTrades,
        numberOfWashTrades
      );
    } else if (await betaFunction(bob)) {
      finding = detectEdge(
        seller,
        buyer,
        tokenId,
        numberOfTrades,
        numberOfWashTrades
      );
    }

    // Insert finding into database
    console.log("adding to database");

    await addTxToDatabase(
      buyer,
      seller,
      nftContractAddress,
      dateTime,
      tokenId,
      exchangeAddress
    );

    await addSybilWallet(buyer, dateTime);
    await addSybilWallet(seller, dateTime);

    await addSybilAsset(nftContractAddress, dateTime);
    await addSybilProtocol(exchangeAddress, dateTime);

    const clusterId = await createOrAddToCluster([buyer, seller], dateTime);
    console.log(
      `Addresses ${buyer} and ${seller} belong to cluster ID: ${clusterId}`
    );

    console.log(
      `the seller wallet ${seller} was used to fund the buyer wallet ${buyer}`
    );
    results.push(finding!);
  }
  return results;
}
export { checkRelationship };
