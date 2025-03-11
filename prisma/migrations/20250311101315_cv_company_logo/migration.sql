/*
  Warnings:

  - A unique constraint covering the columns `[applicantId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cvId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyName` to the `Cv` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_applicantId_fkey";

-- AlterTable
ALTER TABLE "Cv" ADD COLUMN     "companyName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "cvId" UUID,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "profileId" UUID,
ADD COLUMN     "width" INTEGER,
ALTER COLUMN "applicantId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_applicantId_key" ON "File"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "File_cvId_key" ON "File"("cvId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE SET NULL ON UPDATE CASCADE;
