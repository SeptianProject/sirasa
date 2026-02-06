/*
  Warnings:

  - You are about to drop the column `campusId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `industryId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "campusId",
DROP COLUMN "industryId";
