import { db, handleError } from "./db-controller";

interface DatabaseRow {
  maxId?: number;
  isExist?: number;
}

export async function getMaxClusterId(): Promise<number | null> {
  return new Promise<number | null>((resolve, reject) => {
    const query = "SELECT MAX(clusterId) as maxId FROM sybil_clusters";

    db.get(query, [], (err, row: DatabaseRow) => {
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

export async function addTxToDatabase(
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

export async function addSybilWallet(
  address: string,
  detectedDate: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const stmt = db.prepare(
      "INSERT OR IGNORE INTO sybil_wallets (walletAddress, firstDetectedDate) VALUES (?, ?)"
    );
    stmt.run(address, detectedDate, (err: Error | null) => {
      if (err) {
        console.error("Error inserting into sybil_wallets table:", err);
        reject(err);
        return;
      }
      stmt.finalize(handleError);
      resolve();
    });
  });
}

export async function addSybilProtocol(
  address: string | null,
  detectedDate: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const stmt = db.prepare(
      "INSERT OR IGNORE INTO sybil_protocols (protocolAddress, firstDetectedDate) VALUES (?, ?)"
    );
    stmt.run(address, detectedDate, (err: Error | null) => {
      if (err) {
        console.error("Error inserting into sybil_protocols table:", err);
        reject(err);
        return;
      }
      stmt.finalize(handleError);
      resolve();
    });
  });
}

export async function addSybilAsset(
  address: string,
  detectedDate: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const stmt = db.prepare(
      "INSERT OR IGNORE INTO sybil_assets (assetAddress, firstDetectedDate) VALUES (?, ?)"
    );
    stmt.run(address, detectedDate, (err: Error | null) => {
      if (err) {
        console.error("Error inserting into sybil_assets table:", err);
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

export async function isAddressInCluster(address: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const query =
      "SELECT EXISTS(SELECT 1 FROM sybil_clusters WHERE address = ? LIMIT 1) as isExist";

    db.get(query, [address], (err, row: DatabaseRow) => {
      if (err) {
        console.error("Error checking if address exists in cluster:", err);
        reject(err);
        return;
      }

      if (row && row.isExist === 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

export async function isAssetHighRisk(address: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const query =
      "SELECT EXISTS(SELECT 1 FROM sybil_assets WHERE assetAddress = ? LIMIT 1) as isExist";

    db.get(query, [address], (err, row: DatabaseRow) => {
      if (err) {
        console.error("Error checking if asset exists in table:", err);
        reject(err);
        return;
      }

      if (row && row.isExist === 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
