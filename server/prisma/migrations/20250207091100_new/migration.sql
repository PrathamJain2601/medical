-- DropIndex
DROP INDEX "User_company_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "company" DROP NOT NULL;
