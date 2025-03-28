/*
  Warnings:

  - The values [Medior] on the enum `JobExperienceLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JobExperienceLevel_new" AS ENUM ('JUNIOR', 'MEDIOR', 'SENIOR');
ALTER TABLE "Job" ALTER COLUMN "experienceRequired" TYPE "JobExperienceLevel_new" USING ("experienceRequired"::text::"JobExperienceLevel_new");
ALTER TYPE "JobExperienceLevel" RENAME TO "JobExperienceLevel_old";
ALTER TYPE "JobExperienceLevel_new" RENAME TO "JobExperienceLevel";
DROP TYPE "JobExperienceLevel_old";
COMMIT;
