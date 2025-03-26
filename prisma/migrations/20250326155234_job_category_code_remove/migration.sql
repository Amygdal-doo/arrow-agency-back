/*
  Warnings:

  - You are about to drop the column `code` on the `JobCategory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "JobCategory_code_key";

-- AlterTable
ALTER TABLE "JobCategory" DROP COLUMN "code";
