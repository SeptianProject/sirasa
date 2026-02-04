-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verificationCertificate" TEXT,
ADD COLUMN     "verificationDocument" TEXT,
ADD COLUMN     "verificationNote" TEXT,
ADD COLUMN     "verificationRequestedAt" TIMESTAMP(3);
