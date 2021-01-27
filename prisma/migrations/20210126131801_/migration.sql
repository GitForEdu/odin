/*
  Warnings:

  - The migration will change the primary key for the `bbGitConnection` table. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "bbGitConnection.courseId_unique";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bbGitConnection" (
    "courseId" TEXT NOT NULL PRIMARY KEY,
    "gitURL" TEXT NOT NULL
);
INSERT INTO "new_bbGitConnection" ("courseId", "gitURL") SELECT "courseId", "gitURL" FROM "bbGitConnection";
DROP TABLE "bbGitConnection";
ALTER TABLE "new_bbGitConnection" RENAME TO "bbGitConnection";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
