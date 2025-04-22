-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "countryOrigin" TEXT,
ADD COLUMN     "nonPreferredProjects" TEXT[],
ADD COLUMN     "nonPreferredWorkCountries" TEXT[],
ADD COLUMN     "preferredWorkCountries" TEXT[];
