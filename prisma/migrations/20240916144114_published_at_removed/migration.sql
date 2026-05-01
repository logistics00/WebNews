/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `WebNews` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WebNews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "page" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "column" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "searchTerms" TEXT,
    "writer" TEXT,
    "origin" TEXT,
    "core" TEXT NOT NULL,
    "core1" TEXT,
    "core2" TEXT,
    "core3" TEXT,
    "core4" TEXT,
    "core5" TEXT,
    "core6" TEXT,
    "core7" TEXT,
    "core8" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WebNews" ("column", "core", "core1", "core2", "core3", "core4", "core5", "core6", "core7", "core8", "createdAt", "filePath", "id", "origin", "page", "searchTerms", "type", "updatedAt", "writer") SELECT "column", "core", "core1", "core2", "core3", "core4", "core5", "core6", "core7", "core8", "createdAt", "filePath", "id", "origin", "page", "searchTerms", "type", "updatedAt", "writer" FROM "WebNews";
DROP TABLE "WebNews";
ALTER TABLE "new_WebNews" RENAME TO "WebNews";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
