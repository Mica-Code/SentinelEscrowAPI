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
    "referral_code" TEXT,
    "marketing_source" TEXT,
    "terms_consent" BOOLEAN NOT NULL DEFAULT true,
    "verificationCode" TEXT,
    "verificationCodeExpiry" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("created_at", "date_of_birth", "email", "fullname", "gender", "id", "marketing_source", "password_hash", "phone", "referral_code", "terms_consent", "updated_at") SELECT "created_at", "date_of_birth", "email", "fullname", "gender", "id", "marketing_source", "password_hash", "phone", "referral_code", "terms_consent", "updated_at" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
