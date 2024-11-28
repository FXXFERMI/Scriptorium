/*
  Warnings:

  - You are about to drop the column `tags` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `CodeTemplate` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Tag" (
    "tagId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TagCodeTemplates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TagCodeTemplates_A_fkey" FOREIGN KEY ("A") REFERENCES "CodeTemplate" ("cid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TagCodeTemplates_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("tagId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TagBlog" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TagBlog_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog" ("bid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TagBlog_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("tagId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Blog" (
    "bid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "Hidden" BOOLEAN NOT NULL DEFAULT false,
    "uid" INTEGER NOT NULL,
    CONSTRAINT "Blog_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Blog" ("Hidden", "bid", "description", "title", "uid") SELECT "Hidden", "bid", "description", "title", "uid" FROM "Blog";
DROP TABLE "Blog";
ALTER TABLE "new_Blog" RENAME TO "Blog";
CREATE TABLE "new_CodeTemplate" (
    "cid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "explanation" TEXT,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "uid" INTEGER NOT NULL,
    "isForked" BOOLEAN NOT NULL DEFAULT false,
    "ogTemplateId" INTEGER,
    CONSTRAINT "CodeTemplate_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CodeTemplate_ogTemplateId_fkey" FOREIGN KEY ("ogTemplateId") REFERENCES "CodeTemplate" ("cid") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CodeTemplate" ("cid", "code", "explanation", "isForked", "language", "ogTemplateId", "title", "uid") SELECT "cid", "code", "explanation", "isForked", "language", "ogTemplateId", "title", "uid" FROM "CodeTemplate";
DROP TABLE "CodeTemplate";
ALTER TABLE "new_CodeTemplate" RENAME TO "CodeTemplate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_TagCodeTemplates_AB_unique" ON "_TagCodeTemplates"("A", "B");

-- CreateIndex
CREATE INDEX "_TagCodeTemplates_B_index" ON "_TagCodeTemplates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TagBlog_AB_unique" ON "_TagBlog"("A", "B");

-- CreateIndex
CREATE INDEX "_TagBlog_B_index" ON "_TagBlog"("B");
