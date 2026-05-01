/*
  Warnings:

  - You are about to drop the column `coreUpdated` on the `WebNews` table. All the data in the column will be lost.

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
    "writer" TEXT,
    "core" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WebNews" ("column", "core", "createdAt", "filePath", "id", "page", "type", "updatedAt", "writer") SELECT "column", "core", "createdAt", "filePath", "id", "page", "type", "updatedAt", "writer" FROM "WebNews";
DROP TABLE "WebNews";
ALTER TABLE "new_WebNews" RENAME TO "WebNews";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
