/*
  Warnings:

  - You are about to drop the column `skills` on the `Cv` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cv" DROP COLUMN "skills";

-- CreateTable
CREATE TABLE "Skills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "efficiency" TEXT NOT NULL,
    "cvId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "skills_CvData_Id_Index" ON "Skills"("cvId");

-- AddForeignKey
ALTER TABLE "Skills" ADD CONSTRAINT "Skills_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE CASCADE ON UPDATE CASCADE;
