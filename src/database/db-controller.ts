import { Database } from "sqlite3";

const sqlite3 = require("sqlite3").verbose();

const db: Database = new sqlite3.Database("./src/database/sybil_detection.db");

interface ClusterIdRow {
  maxId: number;
}

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

export async function getMaxClusterId(): Promise<number | null> {
  return new Promise<number | null>((resolve, reject) => {
    const query = "SELECT MAX(clusterId) as maxId FROM sybil_clusters";

    db.get(query, [], (err, row: ClusterIdRow) => {
      if (err) {
        console.error("Error fetching max cluster ID:", err);
        reject(err);
        return;
      }

      if (row && row.maxId !== null && row.maxId !== undefined) {
        resolve(row.maxId);
      } else {
        resolve(null);
      }
    });
  });
}

export async function addToDatabase(
  buyer: string,
  seller: string,
  nftContractAddress: string,
  transactionDateTime: string,
  nftId: string,
  exchangeAddress: string | null
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const stmt = db.prepare(
      "INSERT INTO nft_trades (buyer, seller, transactionDate, nftContractAddress, nftId, exchangeAddress) VALUES (?, ?, ?, ?, ?, ?)"
    );

    stmt.run(
      buyer,
      seller,
      transactionDateTime,
      nftContractAddress,
      nftId,
      exchangeAddress,
      (err: Error | null) => {
        if (err) {
          console.error("Error inserting into nft_trades table:", err);
          reject(err);
          return;
        }
        stmt.finalize(handleError);
        resolve();
      }
    );
  });
}

export async function addSybilAddress(
  address: string,
  detectedDate: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const stmt = db.prepare(
      "INSERT OR IGNORE INTO sybil_addresses (address, firstDetectedDate) VALUES (?, ?)"
    );
    stmt.run(address, detectedDate, (err: Error | null) => {
      if (err) {
        console.error("Error inserting into sybil_addresses table:", err);
        reject(err);
        return;
      }
      stmt.finalize(handleError);
      resolve();
    });
  });
}

export async function addAddressToCluster(
  clusterId: number,
  address: string,
  addedDate: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const stmt = db.prepare(
      "INSERT INTO sybil_clusters (clusterId, address, addedDate) VALUES (?, ?, ?)"
    );
    stmt.run(clusterId, address, addedDate, (err: Error | null) => {
      if (err) {
        console.error("Error inserting into sybil_clusters table:", err);
        reject(err);
        return;
      }
      stmt.finalize(handleError);
      resolve();
    });
  });
}
export async function getClusterIdForAddress(
  address: string
): Promise<number | null> {
  return new Promise<number | null>((resolve, reject) => {
    db.get(
      "SELECT clusterId FROM sybil_clusters WHERE address = ? LIMIT 1",
      [address],
      (err: Error | null, row: any) => {
        if (err) {
          console.error("Error fetching clusterId for address:", err);
          reject(err);
          return;
        }
        resolve(row ? row.clusterId : null);
      }
    );
  });
}

// Get the latest cluster ID to facilitate the generation of new cluster IDs
export async function getLatestClusterId(): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    db.get(
      "SELECT MAX(clusterId) as maxClusterId FROM sybil_clusters",
      (err: Error | null, row: any) => {
        if (err) {
          console.error("Error fetching the latest clusterId:", err);
          reject(err);
          return;
        }
        resolve(row ? row.maxClusterId : 0);
      }
    );
  });
}

function handleError(err: Error | null): void {
  if (err) {
    console.error("Database error:", err);
  }
}
