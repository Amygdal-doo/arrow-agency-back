/*
  Warnings:

  - You are about to drop the column `userId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `User` table. All the data in the column will be lost.
  - Added the required column `amountPaid` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ammount` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `panToken` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `price` on the `SubscriptionPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "userId",
ADD COLUMN     "amountPaid" MONEY NOT NULL,
ADD COLUMN     "customerId" UUID;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "organizationId",
ADD COLUMN     "ammount" MONEY NOT NULL,
ADD COLUMN     "customerId" UUID NOT NULL,
ADD COLUMN     "panToken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionPlan" DROP COLUMN "price",
ADD COLUMN     "price" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "customerId";

-- CreateTable
CREATE TABLE "Customer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");

-- CreateIndex
CREATE INDEX "customer_User_Id_Index" ON "Customer"("userId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
