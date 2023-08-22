import { Database } from "sqlite3";

const sqlite3 = require("sqlite3").verbose();

const db: Database = new sqlite3.Database("./src/database/clusters.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS findings (id INTEGER PRIMARY KEY, buyer TEXT, seller TEXT, date TEXT)",
    (err: Error | null) => {
      if (err) {
        console.error("Error creating table:", err);
      }
    }
  );
});

export async function addToDatabase(
  buyer: string,
  seller: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
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
}
