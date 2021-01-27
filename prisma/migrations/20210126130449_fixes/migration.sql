/*
  Warnings:

  - The migration will change the primary key for the `bbGitConnection` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseid` on the `bbGitConnection` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `bbGitConnection` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "bbGitConnection.courseid_unique";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bbGitConnection" (
    "courseId" TEXT NOT NULL,
    "gitURL" TEXT NOT NULL,

    PRIMARY KEY ("courseId", "gitURL")
);
INSERT INTO "new_bbGitConnection" ("gitURL") SELECT "gitURL" FROM "bbGitConnection";
DROP TABLE "bbGitConnection";
ALTER TABLE "new_bbGitConnection" RENAME TO "bbGitConnection";
CREATE UNIQUE INDEX "bbGitConnection.courseId_unique" ON "bbGitConnection"("courseId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
