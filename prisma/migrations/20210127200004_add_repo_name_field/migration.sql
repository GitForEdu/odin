/*
  Warnings:

  - Added the required column `repoName` to the `bbGitConnection` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bbGitConnection" (
    "courseId" TEXT NOT NULL PRIMARY KEY,
    "gitURL" TEXT NOT NULL,
    "repoName" TEXT NOT NULL
);
INSERT INTO "new_bbGitConnection" ("courseId", "gitURL") SELECT "courseId", "gitURL" FROM "bbGitConnection";
DROP TABLE "bbGitConnection";
ALTER TABLE "new_bbGitConnection" RENAME TO "bbGitConnection";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
