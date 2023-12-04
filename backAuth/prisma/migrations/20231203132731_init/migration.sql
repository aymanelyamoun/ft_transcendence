/*
  Warnings:

  - A unique constraint covering the columns `[displayName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `displayName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "displayName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_displayName_key" ON "User"("displayName");
