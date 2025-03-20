/*
  Warnings:

  - You are about to drop the column `colorPalette` on the `Cv` table. All the data in the column will be lost.
  - Added the required column `primaryColor` to the `Cv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondaryColor` to the `Cv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tertiaryColor` to the `Cv` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cv" DROP COLUMN "colorPalette",
ADD COLUMN     "primaryColor" TEXT NOT NULL,
ADD COLUMN     "secondaryColor" TEXT NOT NULL,
ADD COLUMN     "tertiaryColor" TEXT NOT NULL;
