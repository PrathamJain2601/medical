/*
  Warnings:

  - You are about to drop the column `sourceCode` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `input` on the `TestCase` table. All the data in the column will be lost.
  - You are about to drop the column `output` on the `TestCase` table. All the data in the column will be lost.
  - Added the required column `sourceCodeFileUrl` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inputFileUrl` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputFileUrl` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "sourceCode",
ADD COLUMN     "sourceCodeFileUrl" TEXT NOT NULL,
ADD COLUMN     "stderrFileUrl" TEXT,
ADD COLUMN     "stdoutFileUrl" TEXT;

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "input",
DROP COLUMN "output",
ADD COLUMN     "inputFileUrl" TEXT NOT NULL,
ADD COLUMN     "outputFileUrl" TEXT NOT NULL;
