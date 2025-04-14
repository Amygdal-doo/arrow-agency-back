/*
  Warnings:

  - You are about to drop the column `public_cv` on the `Applicant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Applicant" DROP COLUMN "public_cv",
ADD COLUMN     "publicCv" BOOLEAN NOT NULL DEFAULT false;
