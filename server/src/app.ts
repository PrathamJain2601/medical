import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {Response, Request} from "express";
import dotenv from "dotenv";
import { startConsumer } from './config/rabbitmq.config.js';
import { isAuthorized } from './middlewares/auth.middleware.js';
dotenv.config();

const app = express();
// startConsumer();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));;

app.use(cors({
    origin: ["*", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.get("/", (req: Request, res: Response)=>{
    res.send("server is running");
})

import auth from "./routes/auth.routes.js";
app.use("/auth", auth);
import { verifyEmail } from './controllers/otp/verify-email.controller.js';
app.get('/verify-email', verifyEmail);
import otp from "./routes/otp.routes.js";
app.use("/otp", otp);
import user from "./routes/user.routes.js";
app.use("/user", isAuthorized, user);
import supplier from "./routes/supplier.routes.js";
app.use("/", supplier);
import product from "./routes/product.routes.js";
app.use("/", product);
import purchaseOrder from "./routes/purchaseOrder.routes.js";
app.use("/", purchaseOrder);
import saleOrder from "./routes/saleOrder.routes.js";
app.use("/", saleOrder);
import stockTransaction from "./routes/stockTransaction.routes.js";
app.use("/", stockTransaction);
import dashboard from "./routes/dashboard.routes.js"
app.use("/", dashboard);

app.get("/protected-route", isAuthorized, (req, res)=>{
    res.send("This is a protected route");
    return;
})

app.listen(PORT, ()=>{
    console.log(`server running on port ${process.env.PORT}`);
});



/*

🔹 Supplier
    GET	/suppliers	Get all suppliers
    GET	/suppliers/:id	Get a specific supplier
    POST	/suppliers	Create a new supplier
    PUT	/suppliers/:id	Update supplier details
    DELETE	/suppliers/:id	Delete a supplier
🔹 Product
    GET	/products	Get all products
    GET	/products/:id	Get a specific product
    POST	/products	Create a new product
    PUT	/products/:id	Update product details
    DELETE	/products/:id	Delete a product
    GET	/products/low-stock	Get products below stock threshold
🔹 Purchase Orders
    GET	/purchase-orders	List all purchase orders
    GET	/purchase-orders/:id	Get details of a purchase order
    POST	/purchase-orders	Create a new purchase order (with items)
    PUT	/purchase-orders/:id	Update a purchase order (optional)
    DELETE	/purchase-orders/:id	Cancel/delete a purchase order
🔹 Sales Orders
    GET	/sales-orders	List all sales orders
    GET	/sales-orders/:id	Get details of a sales order
    POST	/sales-orders	Create a new sales order (with items)
    PUT	/sales-orders/:id	Update a sales order (optional)
    DELETE	/sales-orders/:id	Delete/cancel a sales order
🔹 Stock Transactions
    GET	/stock-transactions	Get all stock movements
    GET	/stock-transactions/:id	Get specific stock transaction
    POST	/stock-transactions	Manually add stock transaction (IN/OUT)
🔹 Reports / Dashboards (optional but useful)
    GET	/reports/stock-summary	Show current stock for all products
    GET	/reports/purchase-summary	Aggregated purchase totals by month
    GET	/reports/sales-summary	Aggregated sales totals by month
    GET	/reports/supplier-performance	Total purchases by supplier


*/