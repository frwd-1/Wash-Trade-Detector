import { db, handleError } from "./db-controller";

export async function addSybilWallet(
  address: string,
  detectedDate: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // Define a query to get the current count
    const currentCountQuery =
      "SELECT washTradeAlertCount FROM sybil_wallets WHERE walletAddress = ?";
    interface WalletRow {
      washTradeAlertCount: number;
    }
    db.get(currentCountQuery, [address], (err, row: WalletRow | undefined) => {
      if (err) {
        console.error(
          "Error fetching washTradeCount from sybil_wallets table:",
          err
        );
        reject(err);
        return;
      }

      // If the address exists, use the count, else start with 0
      const washTradeCount = row ? row.washTradeAlertCount + 1 : 1;

      let riskRating: string;
      if (washTradeCount > 10) {
        riskRating = "high";
      } else if (washTradeCount > 5) {
        riskRating = "medium";
      } else {
        riskRating = "low";
      }

      const stmt = db.prepare(
        "INSERT OR IGNORE INTO sybil_wallets (walletAddress, riskRating, washTradeAlertCount, firstDetectedDate) VALUES (?, ?, ?, ?)"
      );

      stmt.run(
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
          stmt.finalize(handleError);
          resolve();
        }
      );
    });
  });
}

export async function addSybilProtocol(
  address: string | null,
  detectedDate: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // Define a query to get the current count
    const currentCountQuery =
      "SELECT washTradeAlertCount FROM sybil_protocols WHERE protocolAddress = ?";
    interface ProtocolRow {
      washTradeAlertCount: number;
    }
    db.get(
      currentCountQuery,
      [address],
      (err, row: ProtocolRow | undefined) => {
        if (err) {
          console.error(
            "Error fetching washTradeCount from sybil_protocols table:",
            err
          );
          reject(err);
          return;
        }

        // If the address exists, use the count, else start with 0
        const washTradeCount = row ? row.washTradeAlertCount + 1 : 1;

        let riskRating: string;
        if (washTradeCount > 10) {
          riskRating = "high";
        } else if (washTradeCount > 5) {
          riskRating = "medium";
        } else {
          riskRating = "low";
        }

        const stmt = db.prepare(
          "INSERT OR IGNORE INTO sybil_protocols (protocolAddress, riskRating, washTradeAlertCount, firstDetectedDate) VALUES (?, ?, ?, ?)"
        );

        stmt.run(
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
            stmt.finalize(handleError);
            resolve();
          }
        );
      }
    );
  });
}

export async function addSybilAsset(
  address: string,
  detectedDate: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // Define a query to get the current count
    const currentCountQuery =
      "SELECT washTradeAlertCount FROM sybil_assets WHERE assetAddress = ?";
    interface AssetRow {
      washTradeAlertCount: number;
    }
    db.get(currentCountQuery, [address], (err, row: AssetRow | undefined) => {
      if (err) {
        console.error(
          "Error fetching washTradeCount from sybil_assets table:",
          err
        );
        reject(err);
        return;
      }

      // If the address exists, use the count, else start with 0
      const washTradeCount = row ? row.washTradeAlertCount + 1 : 1;

      let riskRating: string;
      if (washTradeCount > 10) {
        riskRating = "high";
      } else if (washTradeCount > 5) {
        riskRating = "medium";
      } else {
        riskRating = "low";
      }

      const stmt = db.prepare(
        "INSERT OR IGNORE INTO sybil_assets (assetAddress, riskRating, washTradeAlertCount, firstDetectedDate) VALUES (?, ?, ?, ?)"
      );

      stmt.run(
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
          stmt.finalize(handleError);
          resolve();
        }
      );
    });
  });
}
