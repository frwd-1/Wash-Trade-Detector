import { Database } from "sqlite3";

const sqlite3 = require("sqlite3").verbose();

export const db: Database = new sqlite3.Database(
  "./src/database/sybil_detection.db"
);

db.serialize(() => {
  // Transactions Table
  db.run(
    "CREATE TABLE IF NOT EXISTS nft_trades (id INTEGER PRIMARY KEY, buyer TEXT, seller TEXT, transactionDate TEXT, nftContractAddress TEXT, nftId TEXT, exchangeAddress TEXT)",
    handleError
  );

  // Wallets Table
  db.run(
    "CREATE TABLE IF NOT EXISTS sybil_wallets (id INTEGER PRIMARY KEY, walletAddress TEXT UNIQUE, riskRating TEXT, washTradeAlertCount INTEGER, firstDetectedDate TEXT)",
    handleError
  );
  // Protocols Table
  db.run(
    "CREATE TABLE IF NOT EXISTS sybil_protocols (id INTEGER PRIMARY KEY, protocolAddress TEXT UNIQUE, riskRating TEXT, washTradeAlertCount INTEGER, firstDetectedDate TEXT)",
    handleError
  );
  // Assets Table
  db.run(
    "CREATE TABLE IF NOT EXISTS sybil_assets (id INTEGER PRIMARY KEY, assetAddress TEXT UNIQUE, riskRating TEXT, washTradeAlertCount INTEGER, firstDetectedDate TEXT)",
    handleError
  );
  // Clusters Table
  db.run(
    "CREATE TABLE IF NOT EXISTS sybil_clusters (id INTEGER PRIMARY KEY, clusterId INTEGER, address TEXT, addedDate TEXT)",
    handleError
  );
});

export function handleError(err: Error | null): void {
  if (err) {
    console.error("Database error:", err);
  }
}
