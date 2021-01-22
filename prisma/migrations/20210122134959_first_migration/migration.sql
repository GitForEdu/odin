-- CreateTable
CREATE TABLE "bbGitConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseid" TEXT NOT NULL,
    "gitURL" TEXT NOT NULL,
    "pat" TEXT NOT NULL
);


-- CreateIndex
CREATE UNIQUE INDEX "bbGitConnection.courseid_unique" ON "bbGitConnection"("courseid");
