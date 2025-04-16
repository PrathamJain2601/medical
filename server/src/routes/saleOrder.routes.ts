import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// List all sales orders
router.get("/sales-orders", async (req: Request, res: Response) => {
    try {
      const query = `SELECT o.*, sod.*, p.* FROM sales_order o LEFT JOIN sales_order_details sod ON o.sales_order_id = sod.sales_order_id LEFT JOIN product p ON sod.product_id = p.product_id;`;
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
      const query = `SELECT o.*, sod.*, p.* FROM sales_order o LEFT JOIN sales_order_details sod ON o.sales_order_id = sod.sales_order_id LEFT JOIN product p ON sod.product_id = p.product_id WHERE o.sales_order_id = <id>;`;
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
      
      const query = `INSERT INTO sales_order (order_date, total_amount) VALUES (NOW(), totalAmount); 
INSERT INTO sales_order_details (sales_order_id, product_id, quantity, unit_price) 
VALUES (LAST_INSERT_ID(), Product_ID1, Quantity1, Unit_Price1);`;
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
  

// Update a sales order 
router.put("/sales-orders/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { items } = req.body;
  
    try {
      const query = `SELECT o.*, sod.* FROM sales_order o LEFT JOIN sales_order_details sod ON o.sales_order_id = sod.sales_order_id WHERE o.sales_order_id = <id>;`;
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
        const query = `DELETE FROM sales_order_details WHERE sales_order_id = <id>;`;
        await prisma.sales_Order_Details.deleteMany({
          where: { Sales_Order_ID: parseInt(id) },
        });
  
        const query2 = `INSERT INTO sales_order_details (sales_order_id, product_id, quantity, unit_price) 
VALUES (<id>, Product_ID1, Quantity1, Unit_Price1);`
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
  
      const query2 = `UPDATE sales_order SET total_amount = totalAmount WHERE sales_order_id = <id>;`;
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
      const query = `SELECT * FROM sales_order WHERE sales_order_id = <id>;`;
      const existingOrder = await prisma.sales_Order.findUnique({
        where: { Sales_Order_ID: parseInt(id) },
      });
  
      if (!existingOrder) {
         res.status(404).json({ success: false, message: "Sales order not found" });
        return;
      }
      const query2 = `DELETE FROM sales_order WHERE sales_order_id = <id>;`;
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
