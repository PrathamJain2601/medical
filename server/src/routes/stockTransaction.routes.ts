import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get all stock movements
router.get("/stock-transactions", async (req: Request, res: Response) => {
    try {
      const transactions = await prisma.stock_Transaction.findMany({
        orderBy: { Transaction_Date: "desc" },
        include: {
          product: true,
        },
      });
  
      res.status(200).json({ success: true, data: transactions });
    } catch (error) {
      console.error("Error fetching stock transactions:", error);
      res.status(500).json({ success: false, message: "Failed to fetch stock movements" });
    }
  });
  

// Get a specific stock transaction
router.get("/stock-transactions/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const transaction = await prisma.stock_Transaction.findUnique({
        where: { Transaction_ID: parseInt(id) },
        include: {
          product: true,
        },
      });
  
      if (!transaction) {
        res.status(404).json({ success: false, message: "Stock transaction not found" });
        return;
      }
  
      res.status(200).json({ success: true, data: transaction });
    } catch (error) {
      console.error("Error fetching stock transaction:", error);
      res.status(500).json({ success: false, message: "Failed to fetch stock transaction" });
    }
  });
  

// Manually add a stock transaction (IN/OUT)
router.post("/stock-transactions", async (req: Request, res: Response) => {
    const { Product_ID, Transaction_Type, Quantity } = req.body;
  
    if (!Product_ID || !Transaction_Type || typeof Quantity !== "number") {
      res.status(400).json({ success: false, message: "Missing or invalid transaction data" });
      return;
    }
  
    try {
      const product = await prisma.product.findUnique({
        where: { Product_ID },
      });
  
      if (!product) {
         res.status(404).json({ success: false, message: "Product not found" });
        return;
      }
  
      let newQuantity = product.Stock_Quantity;
  
      if (Transaction_Type === "IN") {
        newQuantity += Quantity;
      } else if (Transaction_Type === "OUT") {
        if (Quantity > product.Stock_Quantity) {
          res.status(400).json({ success: false, message: "Insufficient stock for OUT transaction" });
          return;
        }
        newQuantity -= Quantity;
      } else {
         res.status(400).json({ success: false, message: "Invalid Transaction_Type (must be IN or OUT)" });
        return;
        }
  
      const transaction = await prisma.stock_Transaction.create({
        data: {
          Product_ID,
          Transaction_Type,
          Quantity,
        },
      });
  
      await prisma.product.update({
        where: { Product_ID },
        data: {
          Stock_Quantity: newQuantity,
        },
      });
  
      res.status(201).json({ success: true, data: transaction });
    } catch (error) {
      console.error("Error creating stock transaction:", error);
      res.status(500).json({ success: false, message: "Failed to create stock transaction" });
    }
  });
  

export default router;
