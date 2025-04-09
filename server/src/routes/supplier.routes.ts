import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get all suppliers
router.get("/suppliers", async (req: Request, res: Response) => {
    try {
        const suppliers = await prisma.supplier.findMany({
          include: {
            products: true,
            purchaseOrders: true,
          },
        });
    
        res.status(200).json({ success: true, data: suppliers });
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ success: false, message: "Failed to fetch suppliers" });
      }
});

// Get a specific supplier
router.get("/suppliers/:id", async(req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const supplier = await prisma.supplier.findUnique({
        where: { Supplier_ID: parseInt(id) },
        include: {
          products: true,
          purchaseOrders: true,
        },
      });
  
      if (!supplier) {
        res.status(404).json({ success: false, message: "Supplier not found" });
        return;
      }
  
      res.status(200).json({ success: true, data: supplier });
    } catch (error) {
      console.error("Error fetching supplier:", error);
      res.status(500).json({ success: false, message: "Failed to fetch supplier" });
    }
});

// Create a new supplier
router.post("/suppliers", async (req: Request, res: Response) => {
    const { Name, Contact_Details, Address } = req.body;
  
    if (!Name) {
      res.status(400).json({ success: false, message: "Name is required" });
      return;
    }
  
    try {
      const newSupplier = await prisma.supplier.create({
        data: {
          Name,
          Contact_Details,
          Address,
        },
      });
  
      res.status(201).json({ success: true, data: newSupplier });
    } catch (error) {
      console.error("Error creating supplier:", error);
      res.status(500).json({ success: false, message: "Failed to create supplier" });
    }
  });
  

// Update supplier details
router.put("/suppliers/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Name, Contact_Details, Address } = req.body;
  
    try {
      const existingSupplier = await prisma.supplier.findUnique({
        where: { Supplier_ID: parseInt(id) },
      });
  
      if (!existingSupplier) {
        res.status(404).json({ success: false, message: "Supplier not found" });
        return;
    }
  
      const updatedSupplier = await prisma.supplier.update({
        where: { Supplier_ID: parseInt(id) },
        data: {
          Name: Name ?? existingSupplier.Name,
          Contact_Details: Contact_Details ?? existingSupplier.Contact_Details,
          Address: Address ?? existingSupplier.Address,
        },
      });
  
      res.status(200).json({ success: true, data: updatedSupplier });
    } catch (error) {
      console.error("Error updating supplier:", error);
      res.status(500).json({ success: false, message: "Failed to update supplier" });
    }
  });
  

// Delete a supplier
router.delete("/suppliers/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const existingSupplier = await prisma.supplier.findUnique({
        where: { Supplier_ID: parseInt(id) },
      });
  
      if (!existingSupplier) {
        res.status(404).json({ success: false, message: "Supplier not found" });
        return;
    }
  
      await prisma.supplier.delete({
        where: { Supplier_ID: parseInt(id) },
      });
  
      res.status(200).json({ success: true, message: "Supplier deleted successfully" });
    } catch (error) {
      console.error("Error deleting supplier:", error);
      res.status(500).json({ success: false, message: "Failed to delete supplier" });
    }
  });
  

export default router;
