/*
  Warnings:

  - You are about to drop the column `verfied` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "verfied",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
