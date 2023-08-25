import {
  Finding,
  FindingSeverity,
  FindingType,
  LogDescription,
  EntityType,
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
import { findFirstSender } from "./find-first-sender";
import {
  addToDatabase,
  addSybilAddress,
  addAddressToCluster,
} from "./database/db-controller";

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
  console.log(numberOfTrades);

  const buyer = getBuyer(transfer);
  const seller = getSeller(transfer);
  console.log(`buyer is ${buyer}`);
  console.log(`seller is ${seller}`);

  const tokenId = getNftId(transfer);
  console.log(`network is ${network}`);
  const sender = await findFirstSender(buyer, network);
  console.log(`sender is ${sender}`);

  const nftContractAddress = getNftContractAddress(transfer);
  console.log(`NFT Contract Address: ${nftContractAddress}`);

  const timestamp = getTimestamp(txEvent);
  console.log(`timestamp is: ${timestamp}`);

  const dateTime = getDateTime(timestamp);
  console.log(`dateTime is: ${dateTime}`);

  const exchangeAddress = getExchangeAddress(txEvent);
  console.log(`exchange address: ${exchangeAddress}`);

  if (sender && sender === seller) {
    countWashTrades();
    const finding = Finding.fromObject({
      name: "NFT Wash Trade",
      description: `NFT Wash Trade - seller funded buyer's wallet`,
      alertId: "NFT-WASH-TRADE",
      severity: FindingSeverity.Medium,
      type: FindingType.Suspicious,
      labels: [
        {
          entityType: EntityType.Address,
          entity: seller,
          label: "attacker",
          confidence: 0.9,
          remove: false,
          metadata: {},
        },
        {
          entityType: EntityType.Address,
          entity: buyer,
          label: "attacker",
          confidence: 0.9,
          remove: false,
          metadata: {},
        },
      ],
      metadata: {
        BuyerWallet: buyer,
        SellerWallet: seller,
        token: `Wash Traded NFT Token ID: ${tokenId}`,
        anomalyScore: `${numberOfWashTrades / numberOfTrades}`,
      },
    });

    // Insert finding into database
    console.log("adding to database");

    await addToDatabase(
      buyer,
      seller,
      nftContractAddress,
      dateTime,
      tokenId,
      exchangeAddress
    );

    await addSybilAddress(buyer, dateTime);
    await addSybilAddress(seller, dateTime);

    await addAddressToCluster(, buyer, dateTime);
    await addAddressToCluster(dateTime, seller, dateTime);

    console.log(
      `the seller wallet ${seller} was used to fund the buyer wallet ${buyer}`
    );
    results.push(finding);
  }
  return results;
}
export { checkRelationship };
