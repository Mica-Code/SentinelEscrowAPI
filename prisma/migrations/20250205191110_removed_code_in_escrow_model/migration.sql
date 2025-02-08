/*
  Warnings:

  - You are about to drop the column `code` on the `Escrow` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Escrow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "initiator_id" TEXT NOT NULL,
    "counterparty_id" TEXT,
    "role" TEXT NOT NULL,
    "total_amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "delivery_date" DATETIME,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "is_funded" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Escrow_initiator_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Escrow_counterparty_id_fkey" FOREIGN KEY ("counterparty_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Escrow" ("counterparty_id", "created_at", "currency", "delivery_date", "id", "initiator_id", "is_funded", "notes", "role", "status", "total_amount", "updated_at") SELECT "counterparty_id", "created_at", "currency", "delivery_date", "id", "initiator_id", "is_funded", "notes", "role", "status", "total_amount", "updated_at" FROM "Escrow";
DROP TABLE "Escrow";
ALTER TABLE "new_Escrow" RENAME TO "Escrow";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
