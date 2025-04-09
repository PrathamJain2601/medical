import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// List all sales orders
router.get("/sales-orders", async (req: Request, res: Response) => {
    try {
      const salesOrders = await prisma.sales_Order.findMany({
        include: {
          details: {
            include: {
              product: true,
            },
          },
        },
      });
  
      res.status(200).json({ success: true, data: salesOrders });
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      res.status(500).json({ success: false, message: "Failed to fetch sales orders" });
    }
  });
  
// Get details of a specific sales order
router.get("/sales-orders/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const salesOrder = await prisma.sales_Order.findUnique({
        where: { Sales_Order_ID: parseInt(id) },
        include: {
          details: {
            include: {
              product: true,
            },
          },
        },
      });
  
      if (!salesOrder) {
          res.status(404).json({ success: false, message: "Sales order not found" });
        return;
      }
  
      res.status(200).json({ success: true, data: salesOrder });
    } catch (error) {
      console.error("Error fetching sales order:", error);
      res.status(500).json({ success: false, message: "Failed to fetch sales order" });
    }
  });
  

// Create a new sales order (with items)
router.post("/sales-orders", async (req: Request, res: Response) => {
    const { items } = req.body;
  
    if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ success: false, message: "Items are required" });
      return;
    }
  
    try {
      // Calculate total amount
      const totalAmount = items.reduce((sum: number, item: any) => {
        return sum + item.Quantity * item.Unit_Price;
      }, 0);
  
      const newSalesOrder = await prisma.sales_Order.create({
        data: {
          Order_Date: new Date(),
          Total_Amount: totalAmount,
          details: {
            create: items.map((item: any) => ({
              Product_ID: item.Product_ID,
              Quantity: item.Quantity,
              Unit_Price: item.Unit_Price,
            })),
          },
        },
        include: {
          details: true,
        },
      });
  
      res.status(201).json({ success: true, data: newSalesOrder });
    } catch (error) {
      console.error("Error creating sales order:", error);
      res.status(500).json({ success: false, message: "Failed to create sales order" });
    }
  });
  

// Update a sales order (optional)
router.put("/sales-orders/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { items } = req.body;
  
    try {
      const existingOrder = await prisma.sales_Order.findUnique({
        where: { Sales_Order_ID: parseInt(id) },
        include: { details: true },
      });
  
      if (!existingOrder) {
          res.status(404).json({ success: false, message: "Sales order not found" });
        return;
      }
  
      let totalAmount:any = existingOrder.Total_Amount;
  
      if (items && Array.isArray(items) && items.length > 0) {
        // Recalculate total
        totalAmount = items.reduce((sum: number, item: any) => {
          return sum + item.Quantity * item.Unit_Price;
        }, 0);
  
        // Delete old items
        await prisma.sales_Order_Details.deleteMany({
          where: { Sales_Order_ID: parseInt(id) },
        });
  
        // Create new items
        await prisma.sales_Order_Details.createMany({
          data: items.map((item: any) => ({
            Sales_Order_ID: parseInt(id),
            Product_ID: item.Product_ID,
            Quantity: item.Quantity,
            Unit_Price: item.Unit_Price,
          })),
        });
      }
  
      const updatedOrder = await prisma.sales_Order.update({
        where: { Sales_Order_ID: parseInt(id) },
        data: {
          Total_Amount: totalAmount,
        },
        include: {
          details: true,
        },
      });
  
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      console.error("Error updating sales order:", error);
      res.status(500).json({ success: false, message: "Failed to update sales order" });
    }
  });
  

// Delete/cancel a sales order
router.delete("/sales-orders/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const existingOrder = await prisma.sales_Order.findUnique({
        where: { Sales_Order_ID: parseInt(id) },
      });
  
      if (!existingOrder) {
         res.status(404).json({ success: false, message: "Sales order not found" });
        return;
      }
  
      await prisma.sales_Order.delete({
        where: { Sales_Order_ID: parseInt(id) },
      });
  
      res.status(200).json({ success: true, message: "Sales order deleted successfully" });
    } catch (error) {
      console.error("Error deleting sales order:", error);
      res.status(500).json({ success: false, message: "Failed to delete sales order" });
    }
  });
  

export default router;
