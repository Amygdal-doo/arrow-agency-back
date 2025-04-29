-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "customerCancelled" BOOLEAN NOT NULL DEFAULT false;
