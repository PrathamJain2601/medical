import { Router } from "express";
import { register, login, logout, forgotPassword, resetPassword, refreshAccessToken } from "../controllers/auth/index.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/refresh-access-token", refreshAccessToken);

export default router;
