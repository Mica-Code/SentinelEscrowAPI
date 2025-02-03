/*
  Warnings:

  - You are about to drop the column `referal_code` on the `User` table. All the data in the column will be lost.
  - Added the required column `referral_code` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "date_of_birth" DATETIME NOT NULL,
    "phone" TEXT NOT NULL,
    "referral_code" TEXT NOT NULL,
    "marketing_source" TEXT NOT NULL,
    "terms_consent" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("created_at", "date_of_birth", "email", "fullname", "gender", "id", "marketing_source", "password_hash", "phone", "terms_consent", "updated_at") SELECT "created_at", "date_of_birth", "email", "fullname", "gender", "id", "marketing_source", "password_hash", "phone", "terms_consent", "updated_at" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
