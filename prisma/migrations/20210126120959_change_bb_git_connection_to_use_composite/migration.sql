/*
  Warnings:

  - The migration will change the primary key for the `bbGitConnection` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `bbGitConnection` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bbGitConnection" (
    "courseid" TEXT NOT NULL,
    "gitURL" TEXT NOT NULL,

    PRIMARY KEY ("courseid", "gitURL")
);
INSERT INTO "new_bbGitConnection" ("courseid", "gitURL") SELECT "courseid", "gitURL" FROM "bbGitConnection";
DROP TABLE "bbGitConnection";
ALTER TABLE "new_bbGitConnection" RENAME TO "bbGitConnection";
CREATE UNIQUE INDEX "bbGitConnection.courseid_unique" ON "bbGitConnection"("courseid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
