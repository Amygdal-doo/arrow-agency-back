/*
  Warnings:

  - Added the required column `workWithB2b` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cv" ADD COLUMN     "fontSize" TEXT NOT NULL DEFAULT '12px';

-- AlterTable
ALTER TABLE "CvLanguage" ALTER COLUMN "efficiency" SET DEFAULT 'medium';

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "workWithB2b" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Skills" ADD COLUMN     "efficiencyTypeNumber" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "efficiency" SET DEFAULT 'medium';
