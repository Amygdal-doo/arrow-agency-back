/*
  Warnings:

  - Added the required column `colorPalette` to the `Cv` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cv" ADD COLUMN     "colorPalette" TEXT NOT NULL,
ADD COLUMN     "showCompanyInfo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showPersonalInfo" BOOLEAN NOT NULL DEFAULT false;
