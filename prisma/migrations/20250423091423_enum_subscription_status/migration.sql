/*
  Warnings:

  - Changed the type of `status` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SUBSCRIPTION_STATUS" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'PENDING');

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "status",
ADD COLUMN     "status" "SUBSCRIPTION_STATUS" NOT NULL;
