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
User Endpoints
Fetch current user	GET	/users/me	Auth token in headers
Fetch user submissions	GET	/users/:userId/submissions	userId in path
Fetch user stats	GET	/users/:userId/stats	userId in path

🔹 Problem Endpoints
    Fetch list of problems	GET	/problems	Optional query params: difficulty, tags, limit, offset
Fetch single problem	GET	/problems/:id	id in path
Fetch sample test cases	GET	/problems/:id/testcases	id in path (returns only sample cases)

🔹 Submission Endpoints
Fetch submissions	GET	/submissions	Optional query params: problemId, userId, limit, offset
Fetch single submission	GET	/submissions/:id	id in path

🔹 Admin-Only Problem Endpoints
    Create a problem	POST	/problems	{ title, statement, difficulty, tags, timeLimit, memoryLimit }
    Update a problem	PUT	/problems/:id	{ title, statement, difficulty, tags, timeLimit, memoryLimit }
    Delete a problem	DELETE	/problems/:id	id in path

🔹 Admin-Only Test Case Endpoints
Add a test case	POST	/problems/:problemId/testcases	{ input, output, isSample }
Remove a test case	DELETE	/testcases/:id	id in path

🔹 Submission Handling
Submit a solution	POST	/submissions	{ problemId, userId, languageId, sourceCode }

🔹 Real-Time Updates (Using WebSockets or Polling)
Live submission status	GET (Polling)	/submissions/:id/status	Can use WebSockets for real-time

*/