import { Router } from "express";
import otp from "../controllers/otp/index.controller";

const router = Router();

router.post("/send-otp", otp.sendOtp);
router.post("/resend-otp", otp.resendOtp);
router.get("/check-verification", otp.checkVerification);

export default router;