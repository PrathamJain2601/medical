import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get all products
router.get("/products", async (req: Request, res: Response) => {
    try {
      const query = `SELECT p.*, s.*, pod.*, sod.*, st.* FROM product p LEFT JOIN supplier s ON p.supplier_id = s.supplier_id LEFT JOIN purchase_order_details pod ON pod.product_id = p.product_id LEFT JOIN sales_order_details sod ON sod.product_id = p.product_id LEFT JOIN stock_transaction st ON st.product_id = p.product_id;`;
      const products = await prisma.product.findMany({
        include: {
          supplier: true,
          purchaseOrderDetails: true,
          salesOrderDetails: true,
          stockTransactions: true,
        },
      });
  
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ success: false, message: "Failed to fetch products" });
    }
  });
  

// Get a specific product
router.get("/products/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const query = `SELECT p.*, s.*, pod.*, sod.*, st.* FROM product p LEFT JOIN supplier s ON p.supplier_id = s.supplier_id LEFT JOIN purchase_order_details pod ON pod.product_id = p.product_id LEFT JOIN sales_order_details sod ON sod.product_id = p.product_id LEFT JOIN stock_transaction st ON st.product_id = p.product_id WHERE p.product_id = <id>;`;
      const product = await prisma.product.findUnique({
        where: { Product_ID: parseInt(id) },
        include: {
          supplier: true,
          purchaseOrderDetails: true,
          salesOrderDetails: true,
          stockTransactions: true,
        },
      });
  
      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
    }
  
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ success: false, message: "Failed to fetch product" });
    }
  });
  

// Create a new product
router.post("/products", async (req: Request, res: Response) => {
    const { Name, Description, Category, Price, Stock_Quantity, Supplier_ID } = req.body;
  
    if (!Name || !Price) {
      
        res.status(400).json({ success: false, message: "Name and Price are required" });
    
        return;}
  
    try {
      const query = `INSERT INTO product (name, description, category, price, stock_quantity, supplier_id) VALUES ('Name', 'Description', 'Category', Price, COALESCE(Stock_Quantity, 0), Supplier_ID);`;
      const newProduct = await prisma.product.create({
        data: {
          Name,
          Description,
          Category,
          Price,
          Stock_Quantity: Stock_Quantity ?? 0,
          Supplier_ID,
        },
      });
  
      res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ success: false, message: "Failed to create product" });
    }
  });
  

// Update product details
router.put("/products/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Name, Description, Category, Price, Stock_Quantity, Supplier_ID } = req.body;
  
    try {
      const query = `SELECT * FROM product WHERE product_id = <id>;`;
      const existingProduct = await prisma.product.findUnique({
        where: { Product_ID: parseInt(id) },
      });
      if (!existingProduct) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
    }
      const query2 = `UPDATE product SET name = COALESCE('Name', name), description = COALESCE('Description', description), category = COALESCE('Category', category), price = COALESCE(Price, price), stock_quantity = COALESCE(Stock_Quantity, stock_quantity), supplier_id = COALESCE(Supplier_ID, supplier_id) WHERE product_id = <id>;`;
      const updatedProduct = await prisma.product.update({
        where: { Product_ID: parseInt(id) },
        data: {
          Name: Name ?? existingProduct.Name,
          Description: Description ?? existingProduct.Description,
          Category: Category ?? existingProduct.Category,
          Price: Price ?? existingProduct.Price,
          Stock_Quantity: Stock_Quantity ?? existingProduct.Stock_Quantity,
          Supplier_ID: Supplier_ID ?? existingProduct.Supplier_ID,
        },
      });
  
      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ success: false, message: "Failed to update product" });
    }
  });
  

// Delete a product
router.delete("/products/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const query = `SELECT * FROM product WHERE product_id = <id>;`;
      const existingProduct = await prisma.product.findUnique({
        where: { Product_ID: parseInt(id) },
      });
  
      if (!existingProduct) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
    }
      const query2 = `DELETE FROM product WHERE product_id = <id>;`;
      await prisma.product.delete({
        where: { Product_ID: parseInt(id) },
      });
  
      res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ success: false, message: "Failed to delete product" });
    }
  });
  

// Get products below stock threshold
router.get("/products/low-stock", async (req: Request, res: Response) => {
    const threshold = parseInt(req.query.threshold as string) || 10;
  
    try {
      const query =  `SELECT p.*, s.* FROM product p LEFT JOIN supplier s ON p.supplier_id = s.supplier_id WHERE p.stock_quantity < <threshold>;`;
      const lowStockProducts = await prisma.product.findMany({
        where: {
          Stock_Quantity: {
            lt: threshold,
          },
        },
        include: {
          supplier: true,
        },
      });
  
      res.status(200).json({ success: true, data: lowStockProducts });
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      res.status(500).json({ success: false, message: "Failed to fetch low stock products" });
    }
  });
  

export default router;
