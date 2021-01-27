/*
  Warnings:

  - You are about to drop the column `pat` on the `bbGitConnection` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "userGitConnection" (
    "userName" TEXT NOT NULL,
    "gitURL" TEXT NOT NULL,
    "pat" TEXT NOT NULL,

    PRIMARY KEY ("userName", "gitURL")
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bbGitConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseid" TEXT NOT NULL,
    "gitURL" TEXT NOT NULL
);
INSERT INTO "new_bbGitConnection" ("id", "courseid", "gitURL") SELECT "id", "courseid", "gitURL" FROM "bbGitConnection";
DROP TABLE "bbGitConnection";
ALTER TABLE "new_bbGitConnection" RENAME TO "bbGitConnection";
CREATE UNIQUE INDEX "bbGitConnection.courseid_unique" ON "bbGitConnection"("courseid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
