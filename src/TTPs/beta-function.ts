import { db } from "../database/db-controller";

export async function betaFunction(address: string): Promise<number | null> {
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
