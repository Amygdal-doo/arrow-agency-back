/*
  Warnings:

  - You are about to drop the column `code` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `jobPositionId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the `JobPosition` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `applicationLinkOrEmail` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeOfApplication` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobExperienceLevel" AS ENUM ('JUNIOR', 'Medior', 'SENIOR');

-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('EMAIL', 'LINK');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_jobPositionId_fkey";

-- DropIndex
DROP INDEX "Organization_code_key";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "code",
DROP COLUMN "jobPositionId",
ADD COLUMN     "applicationLinkOrEmail" TEXT NOT NULL,
ADD COLUMN     "experienceRequired" "JobExperienceLevel",
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "typeOfApplication" "ApplicationType" NOT NULL;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "code";

-- DropTable
DROP TABLE "JobPosition";
