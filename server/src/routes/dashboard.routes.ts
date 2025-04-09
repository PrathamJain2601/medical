import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Show current stock for all products
router.get("/reports/stock-summary", async (req: Request, res: Response) => {
    try {
      const stockSummary = await prisma.product.findMany({
        select: {
          Product_ID: true,
          Name: true,
          Stock_Quantity: true,
          Category: true,
          Price: true,
        },
        orderBy: {
          Name: "asc",
        },
      });
  
      res.status(200).json({ success: true, data: stockSummary });
    } catch (error) {
      console.error("Error fetching stock summary:", error);
      res.status(500).json({ success: false, message: "Failed to fetch stock summary" });
    }
  });
  

// Aggregated purchase totals by month
router.get("/reports/purchase-summary", async (req: Request, res: Response) => {
    try {
      const purchaseSummary = await prisma.purchase_Order.groupBy({
        by: ["Order_Date"],
        _sum: {
          Total_Amount: true,
        },
        where: {
          Order_Date: {
            gte: new Date(new Date().getFullYear(), 0, 1), // Start of current year
          },
        },
        orderBy: {
          Order_Date: "asc",
        },
      });
  
      // Group by month
      const monthlySummary = purchaseSummary.map((entry) => ({
        month: entry.Order_Date.toISOString().slice(0, 7), // Format as YYYY-MM
        totalAmount: entry._sum.Total_Amount,
      }));
  
      res.status(200).json({ success: true, data: monthlySummary });
    } catch (error) {
      console.error("Error fetching purchase summary:", error);
      res.status(500).json({ success: false, message: "Failed to fetch purchase summary" });
    }
  });
  

// Aggregated sales totals by month
router.get("/reports/sales-summary", async (req: Request, res: Response) => {
    try {
      const salesSummary = await prisma.sales_Order.groupBy({
        by: ["Order_Date"],
        _sum: {
          Total_Amount: true,
        },
        where: {
          Order_Date: {
            gte: new Date(new Date().getFullYear(), 0, 1), // Start of current year
          },
        },
        orderBy: {
          Order_Date: "asc",
        },
      });
  
      const monthlySummary = salesSummary.map((entry) => ({
        month: entry.Order_Date.toISOString().slice(0, 7), // Format: YYYY-MM
        totalAmount: entry._sum.Total_Amount,
      }));
  
      res.status(200).json({ success: true, data: monthlySummary });
    } catch (error) {
      console.error("Error fetching sales summary:", error);
      res.status(500).json({ success: false, message: "Failed to fetch sales summary" });
    }
  });


// Total purchases by supplier
router.get("/reports/supplier-performance", async (req: Request, res: Response) => {
    try {
      const summary = await prisma.purchase_Order.groupBy({
        by: ["Supplier_ID"],
        _sum: {
          Total_Amount: true,
        },
      });
  
      const suppliers = await prisma.supplier.findMany({
        select: {
          Supplier_ID: true,
          Name: true,
        },
      });
  
      const result = summary.map((entry) => {
        const supplier = suppliers.find(s => s.Supplier_ID === entry.Supplier_ID);
        return {
          Supplier_ID: entry.Supplier_ID,
          Name: supplier?.Name || "Unknown Supplier",
          Total_Purchases: entry._sum.Total_Amount,
        };
      });
  
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error fetching supplier performance:", error);
      res.status(500).json({ success: false, message: "Failed to fetch supplier performance" });
    }
  });
  

export default router;
