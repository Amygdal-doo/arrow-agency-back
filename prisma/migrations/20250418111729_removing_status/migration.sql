/*
  Warnings:

  - You are about to drop the column `status` on the `SubscriptionPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubscriptionPlan" DROP COLUMN "status";

-- DropEnum
DROP TYPE "SUBSCRIPTION_STATUS";
