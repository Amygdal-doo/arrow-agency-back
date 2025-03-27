/*
  Warnings:

  - Added the required column `createdBy` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CreatedBy" AS ENUM ('LOGGED_USER', 'NOT_LOGGED');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "createdBy" "CreatedBy" NOT NULL,
ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "createdBy" "CreatedBy" NOT NULL,
ADD COLUMN     "userId" UUID;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
