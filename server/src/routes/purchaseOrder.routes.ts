import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// List all purchase orders
router.get("/purchase-orders", async (req: Request, res: Response) => {
    try {
      const orders = await prisma.purchase_Order.findMany({
        include: {
          supplier: true,
          details: {
            include: {
              product: true,
            },
          },
        },
      });
  
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      res.status(500).json({ success: false, message: "Failed to fetch purchase orders" });
    }
  });
  

// Get details of a specific purchase order
router.get("/purchase-orders/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const order = await prisma.purchase_Order.findUnique({
        where: { Purchase_Order_ID: parseInt(id) },
        include: {
          supplier: true,
          details: {
            include: {
              product: true,
            },
          },
        },
      });
  
      if (!order) {
        res.status(404).json({ success: false, message: "Purchase order not found" });
        return;
    }
  
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error("Error fetching purchase order:", error);
      res.status(500).json({ success: false, message: "Failed to fetch purchase order" });
    }
  });
  

// Create a new purchase order (with items)
router.post("/purchase-orders", async (req: Request, res: Response) => {
    const { Supplier_ID, items } = req.body;
  
    if (!Supplier_ID || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: "Supplier_ID and items are required" });
      return;
    }
  
    try {
      // Calculate total amount from items
      const totalAmount = items.reduce((sum: number, item: any) => {
        return sum + item.Quantity * item.Unit_Price;
      }, 0);
  
      const newOrder = await prisma.purchase_Order.create({
        data: {
          Supplier_ID,
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
  
      res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
      console.error("Error creating purchase order:", error);
      res.status(500).json({ success: false, message: "Failed to create purchase order" });
    }
  });
  

// Update a purchase order (optional)
router.put("/purchase-orders/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Supplier_ID, items } = req.body;
  
    try {
      const existingOrder = await prisma.purchase_Order.findUnique({
        where: { Purchase_Order_ID: parseInt(id) },
        include: { details: true },
      });
  
      if (!existingOrder) {
        res.status(404).json({ success: false, message: "Purchase order not found" });
        return;
      }
  
      let totalAmount:any = existingOrder.Total_Amount;
  
      if (items && Array.isArray(items) && items.length > 0) {
        // Recalculate total
        totalAmount = items.reduce((sum: number, item: any) => {
          return sum + item.Quantity * item.Unit_Price;
        }, 0);
  
        // Delete old items
        await prisma.purchase_Order_Details.deleteMany({
          where: { Purchase_Order_ID: parseInt(id) },
        });
  
        // Create new items
        await prisma.purchase_Order_Details.createMany({
          data: items.map((item: any) => ({
            Purchase_Order_ID: parseInt(id),
            Product_ID: item.Product_ID,
            Quantity: item.Quantity,
            Unit_Price: item.Unit_Price,
          })),
        });
      }
  
      const updatedOrder = await prisma.purchase_Order.update({
        where: { Purchase_Order_ID: parseInt(id) },
        data: {
          Supplier_ID: Supplier_ID ?? existingOrder.Supplier_ID,
          Total_Amount: totalAmount,
        },
        include: {
          details: true,
        },
      });
  
      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      console.error("Error updating purchase order:", error);
      res.status(500).json({ success: false, message: "Failed to update purchase order" });
    }
  });
  

// Cancel/delete a purchase order
router.delete("/purchase-orders/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const existingOrder = await prisma.purchase_Order.findUnique({
        where: { Purchase_Order_ID: parseInt(id) },
      });
  
      if (!existingOrder) {
        res.status(404).json({ success: false, message: "Purchase order not found" });
        return;
    }
  
      await prisma.purchase_Order.delete({
        where: { Purchase_Order_ID: parseInt(id) },
      });
  
      res.status(200).json({ success: true, message: "Purchase order deleted successfully" });
    } catch (error) {
      console.error("Error deleting purchase order:", error);
      res.status(500).json({ success: false, message: "Failed to delete purchase order" });
    }
  });
  

export default router;
