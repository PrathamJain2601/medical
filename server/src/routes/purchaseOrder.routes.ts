import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// List all purchase orders
router.get("/purchase-orders", async (req: Request, res: Response) => {
    try {
      const query = `SELECT o.*, s.*, pod.*, p.* FROM purchase_order o LEFT JOIN supplier s ON o.supplier_id = s.supplier_id LEFT JOIN purchase_order_details pod ON o.purchase_order_id = pod.purchase_order_id LEFT JOIN product p ON pod.product_id = p.product_id;`;
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
      const query = `SELECT o.*, s.*, pod.*, p.* FROM purchase_order o LEFT JOIN supplier s ON o.supplier_id = s.supplier_id LEFT JOIN purchase_order_details pod ON o.purchase_order_id = pod.purchase_order_id LEFT JOIN product p ON pod.product_id = p.product_id WHERE o.purchase_order_id = <id>;`;
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
      
      const query = `INSERT INTO purchase_order (supplier_id, order_date, total_amount) VALUES (Supplier_ID, NOW(), totalAmount); INSERT INTO purchase_order_details (purchase_order_id, product_id, quantity, unit_price) SELECT LAST_INSERT_ID(), Product_ID, Quantity, Unit_Price FROM (VALUES (Product_ID1, Quantity1, Unit_Price1), (Product_ID2, Quantity2, Unit_Price2), ...) AS items (Product_ID, Quantity, Unit_Price);`;
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
      const query = `SELECT o.*, pod.* FROM purchase_order o LEFT JOIN purchase_order_details pod ON o.purchase_order_id = pod.purchase_order_id WHERE o.purchase_order_id = <id>;`;
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
        const query2 = `INSERT INTO purchase_order_details (purchase_order_id, product_id, quantity, unit_price) VALUES (<id>, Product_ID1, Quantity1, Unit_Price1);`;
        await prisma.purchase_Order_Details.createMany({
          data: items.map((item: any) => ({
            Purchase_Order_ID: parseInt(id),
            Product_ID: item.Product_ID,
            Quantity: item.Quantity,
            Unit_Price: item.Unit_Price,
          })),
        });
      }
  
      const query3 = `UPDATE purchase_order SET supplier_id = COALESCE(Supplier_ID, supplier_id), total_amount = totalAmount WHERE purchase_order_id = <id>;`;
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
      const query = `SELECT * FROM purchase_order WHERE purchase_order_id = <id>;`;
      const existingOrder = await prisma.purchase_Order.findUnique({
        where: { Purchase_Order_ID: parseInt(id) },
      });
  
      if (!existingOrder) {
        res.status(404).json({ success: false, message: "Purchase order not found" });
        return;
    }
      const query2 = `DELETE FROM purchase_order WHERE purchase_order_id = <id>;`;
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
