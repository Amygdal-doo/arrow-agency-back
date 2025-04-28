/*
  Warnings:

  - Added the required column `cITId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "cITId" TEXT;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "cITId" TEXT NOT NULL;
