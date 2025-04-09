import { Router, Request, Response } from "express";

const router = Router();

// Show current stock for all products
router.get("/reports/stock-summary", (req: Request, res: Response) => {
  res.send("Show current stock for all products");
});

// Aggregated purchase totals by month
router.get("/reports/purchase-summary", (req: Request, res: Response) => {
  res.send("Aggregated purchase totals by month");
});

// Aggregated sales totals by month
router.get("/reports/sales-summary", (req: Request, res: Response) => {
  res.send("Aggregated sales totals by month");
});

// Total purchases by supplier
router.get("/reports/supplier-performance", (req: Request, res: Response) => {
  res.send("Total purchases by supplier");
});

export default router;
