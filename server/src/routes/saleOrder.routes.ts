import { Router, Request, Response } from "express";

const router = Router();

// List all sales orders
router.get("/sales-orders", (req: Request, res: Response) => {
  res.send("List all sales orders");
});

// Get details of a specific sales order
router.get("/sales-orders/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.send(`Get details of sales order with ID ${id}`);
});

// Create a new sales order (with items)
router.post("/sales-orders", (req: Request, res: Response) => {
  const salesOrderData = req.body;
  res.send("Create new sales order with items");
});

// Update a sales order (optional)
router.put("/sales-orders/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  res.send(`Update sales order with ID ${id}`);
});

// Delete/cancel a sales order
router.delete("/sales-orders/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.send(`Delete or cancel sales order with ID ${id}`);
});

export default router;
