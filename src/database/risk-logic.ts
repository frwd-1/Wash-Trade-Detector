import { db, handleError } from "./db-controller";
import { getWashTradeCountForAddress } from "./db-utils";

export async function addSybilWallet(
  address: string,
  detectedDate: string
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const currentCount = await getWashTradeCountForAddress(
        address,
        "sybil_wallets"
      );

      // If the address exists, use the count, else start with 0
      const washTradeCount = currentCount !== null ? currentCount + 1 : 1;

      let riskRating: string;
      if (washTradeCount > 10) {
        riskRating = "high";
      } else if (washTradeCount > 5) {
        riskRating = "medium";
      } else {
        riskRating = "low";
      }

      // If the address already exists in the table, UPDATE it
      if (currentCount !== null) {
        const updateStmt = db.prepare(
          "UPDATE sybil_wallets SET riskRating = ?, washTradeAlertCount = ? WHERE walletAddress = ?"
        );
        updateStmt.run(
          riskRating,
          washTradeCount,
          address,
          (err: Error | null) => {
            if (err) {
              console.error("Error updating sybil_wallets table:", err);
              reject(err);
              return;
            }
            updateStmt.finalize(handleError);
            resolve();
          }
        );
      } else {
        // If the address doesn't exist in the table, INSERT it
        const insertStmt = db.prepare(
          "INSERT INTO sybil_wallets (walletAddress, riskRating, washTradeAlertCount, firstDetectedDate) VALUES (?, ?, ?, ?)"
        );
        insertStmt.run(
          address,
          riskRating,
          washTradeCount,
          detectedDate,
          (err: Error | null) => {
            if (err) {
              console.error("Error inserting into sybil_wallets table:", err);
              reject(err);
              return;
            }
            insertStmt.finalize(handleError);
            resolve();
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });
}

export async function addSybilProtocol(
  address: string | null,
  detectedDate: string
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const currentCount = await getWashTradeCountForAddress(
        address,
        "sybil_protocols"
      );

      const washTradeCount = currentCount !== null ? currentCount + 1 : 1;

      let riskRating: string;
      if (washTradeCount > 10) {
        riskRating = "high";
      } else if (washTradeCount > 5) {
        riskRating = "medium";
      } else {
        riskRating = "low";
      }

      if (currentCount !== null) {
        const updateStmt = db.prepare(
          "UPDATE sybil_protocols SET riskRating = ?, washTradeAlertCount = ? WHERE protocolAddress = ?"
        );
        updateStmt.run(
          riskRating,
          washTradeCount,
          address,
          (err: Error | null) => {
            if (err) {
              console.error("Error updating sybil_protocols table:", err);
              reject(err);
              return;
            }
            updateStmt.finalize(handleError);
            resolve();
          }
        );
      } else {
        const insertStmt = db.prepare(
          "INSERT INTO sybil_protocols (protocolAddress, riskRating, washTradeAlertCount, firstDetectedDate) VALUES (?, ?, ?, ?)"
        );
        insertStmt.run(
          address,
          riskRating,
          washTradeCount,
          detectedDate,
          (err: Error | null) => {
            if (err) {
              console.error("Error inserting into sybil_protocols table:", err);
              reject(err);
              return;
            }
            insertStmt.finalize(handleError);
            resolve();
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });
}

export async function addSybilAsset(
  address: string,
  detectedDate: string
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const currentCount = await getWashTradeCountForAddress(
        address,
        "sybil_assets"
      );

      const washTradeCount = currentCount !== null ? currentCount + 1 : 1;

      let riskRating: string;
      if (washTradeCount > 10) {
        riskRating = "high";
      } else if (washTradeCount > 5) {
        riskRating = "medium";
      } else {
        riskRating = "low";
      }

      if (currentCount !== null) {
        const updateStmt = db.prepare(
          "UPDATE sybil_assets SET riskRating = ?, washTradeAlertCount = ? WHERE assetAddress = ?"
        );
        updateStmt.run(
          riskRating,
          washTradeCount,
          address,
          (err: Error | null) => {
            if (err) {
              console.error("Error updating sybil_assets table:", err);
              reject(err);
              return;
            }
            updateStmt.finalize(handleError);
            resolve();
          }
        );
      } else {
        const insertStmt = db.prepare(
          "INSERT INTO sybil_assets (assetAddress, riskRating, washTradeAlertCount, firstDetectedDate) VALUES (?, ?, ?, ?)"
        );
        insertStmt.run(
          address,
          riskRating,
          washTradeCount,
          detectedDate,
          (err: Error | null) => {
            if (err) {
              console.error("Error inserting into sybil_assets table:", err);
              reject(err);
              return;
            }
            insertStmt.finalize(handleError);
            resolve();
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });
}
