/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Otp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt";
