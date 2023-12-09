/*
  Warnings:

  - Added the required column `typeLog` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LOG_TYPE" AS ENUM ('locallylog', 'googlelog', 'intralog');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "typeLog" "LOG_TYPE" NOT NULL;
