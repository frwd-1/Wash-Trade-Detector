import {
  Finding,
  FindingSeverity,
  FindingType,
  LogDescription,
  EntityType,
  Network,
} from "forta-agent";
import { getBuyer, getSeller, getNftId } from "./utils";
import { findFirstSender } from "./find-first-sender";
import { Database } from "sqlite3";

const sqlite3 = require("sqlite3").verbose();

const db: Database = new sqlite3.Database("./clusters.db");

db.serialize(() => {
  // Create table if it doesn't exist
  db.run(
    "CREATE TABLE IF NOT EXISTS findings (id INTEGER PRIMARY KEY, buyer TEXT, seller TEXT, date TEXT)",
    (err: Error | null) => {
      if (err) {
        console.error("Error creating table:", err);
      }
    }
  );
});

let numberOfTrades: number = 0;
let numberOfWashTrades: number = 0;

async function checkRelationship(
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

    const runStatement = new Promise<void>((resolve, reject) => {
      const stmt = db.prepare(
        "INSERT INTO findings (buyer, seller, date) VALUES (?, ?, ?)"
      );

      stmt.run(buyer, seller, new Date().toISOString(), (err: Error | null) => {
        if (err) {
          console.error("Error inserting into table:", err);
          reject(err);
          return;
        }
        stmt.finalize((err: Error | null) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    });

    await runStatement;

    console.log(
      `the seller wallet ${seller} was used to fund the buyer wallet ${buyer}`
    );
    results.push(finding);
  }
  return results;
}
export { checkRelationship };
