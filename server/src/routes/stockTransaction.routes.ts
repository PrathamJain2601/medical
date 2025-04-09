import { Router, Request, Response } from "express";

const router = Router();

// Get all stock movements
router.get("/stock-transactions", (req: Request, res: Response) => {
  res.send("Get all stock movements");
});

// Get a specific stock transaction
router.get("/stock-transactions/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.send(`Get stock transaction with ID ${id}`);
});

// Manually add a stock transaction (IN/OUT)
router.post("/stock-transactions", (req: Request, res: Response) => {
  const transactionData = req.body;
  res.send("Manually add stock transaction (IN/OUT)");
});

export default router;
