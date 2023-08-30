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

  // Sybil Addresses Table
  db.run(
    "CREATE TABLE IF NOT EXISTS sybil_addresses (id INTEGER PRIMARY KEY, address TEXT UNIQUE, firstDetectedDate TEXT)",
    handleError
  );

  // Sybil Clusters Table
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
