-- CreateTable
CREATE TABLE "applicant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" VARCHAR(256) NOT NULL,
    "lastName" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "phone" TEXT,
    "technologies" TEXT[],
    "cvData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_unique" ON "applicant"("email");

-- CreateIndex
CREATE INDEX "email_Index" ON "applicant"("email");

-- CreateIndex
CREATE INDEX "id_Index" ON "applicant"("id");
