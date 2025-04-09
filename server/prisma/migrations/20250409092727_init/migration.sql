/*
  Warnings:

  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Problem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestCase` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('IN', 'OUT');

-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_email_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_problemId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_userId_fkey";

-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_problemId_fkey";

-- DropTable
DROP TABLE "Otp";

-- DropTable
DROP TABLE "Problem";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Submission";

-- DropTable
DROP TABLE "TestCase";

-- DropEnum
DROP TYPE "Difficulty";

-- CreateTable
CREATE TABLE "Supplier" (
    "Supplier_ID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Contact_Details" TEXT,
    "Address" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("Supplier_ID")
);

-- CreateTable
CREATE TABLE "Product" (
    "Product_ID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "Category" TEXT,
    "Price" DECIMAL(10,2) NOT NULL,
    "Stock_Quantity" INTEGER NOT NULL DEFAULT 0,
    "Supplier_ID" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("Product_ID")
);

-- CreateTable
CREATE TABLE "Purchase_Order" (
    "Purchase_Order_ID" SERIAL NOT NULL,
    "Order_Date" TIMESTAMP(3) NOT NULL,
    "Total_Amount" DECIMAL(10,2) NOT NULL,
    "Supplier_ID" INTEGER NOT NULL,

    CONSTRAINT "Purchase_Order_pkey" PRIMARY KEY ("Purchase_Order_ID")
);

-- CreateTable
CREATE TABLE "Purchase_Order_Details" (
    "Purchase_Order_ID" INTEGER NOT NULL,
    "Product_ID" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "Unit_Price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Purchase_Order_Details_pkey" PRIMARY KEY ("Purchase_Order_ID","Product_ID")
);

-- CreateTable
CREATE TABLE "Sales_Order" (
    "Sales_Order_ID" SERIAL NOT NULL,
    "Order_Date" TIMESTAMP(3) NOT NULL,
    "Total_Amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Sales_Order_pkey" PRIMARY KEY ("Sales_Order_ID")
);

-- CreateTable
CREATE TABLE "Sales_Order_Details" (
    "Sales_Order_ID" INTEGER NOT NULL,
    "Product_ID" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "Unit_Price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Sales_Order_Details_pkey" PRIMARY KEY ("Sales_Order_ID","Product_ID")
);

-- CreateTable
CREATE TABLE "Stock_Transaction" (
    "Transaction_ID" SERIAL NOT NULL,
    "Product_ID" INTEGER NOT NULL,
    "Transaction_Type" "TransactionType" NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "Transaction_Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stock_Transaction_pkey" PRIMARY KEY ("Transaction_ID")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_Supplier_ID_fkey" FOREIGN KEY ("Supplier_ID") REFERENCES "Supplier"("Supplier_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase_Order" ADD CONSTRAINT "Purchase_Order_Supplier_ID_fkey" FOREIGN KEY ("Supplier_ID") REFERENCES "Supplier"("Supplier_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase_Order_Details" ADD CONSTRAINT "Purchase_Order_Details_Purchase_Order_ID_fkey" FOREIGN KEY ("Purchase_Order_ID") REFERENCES "Purchase_Order"("Purchase_Order_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase_Order_Details" ADD CONSTRAINT "Purchase_Order_Details_Product_ID_fkey" FOREIGN KEY ("Product_ID") REFERENCES "Product"("Product_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sales_Order_Details" ADD CONSTRAINT "Sales_Order_Details_Sales_Order_ID_fkey" FOREIGN KEY ("Sales_Order_ID") REFERENCES "Sales_Order"("Sales_Order_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sales_Order_Details" ADD CONSTRAINT "Sales_Order_Details_Product_ID_fkey" FOREIGN KEY ("Product_ID") REFERENCES "Product"("Product_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock_Transaction" ADD CONSTRAINT "Stock_Transaction_Product_ID_fkey" FOREIGN KEY ("Product_ID") REFERENCES "Product"("Product_ID") ON DELETE CASCADE ON UPDATE CASCADE;
