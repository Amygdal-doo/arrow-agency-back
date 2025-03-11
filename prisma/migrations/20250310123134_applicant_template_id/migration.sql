/*
  Warnings:

  - Added the required column `templateId` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "templateId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Skills" ALTER COLUMN "efficiency" SET DEFAULT 'null';
