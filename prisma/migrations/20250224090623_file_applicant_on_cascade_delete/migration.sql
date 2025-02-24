-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_applicantId_fkey";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
