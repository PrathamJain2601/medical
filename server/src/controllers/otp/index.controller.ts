import { checkVerification } from "./check-verification.controller";
import { resendOtp } from "./resend-otp.controller";
import { sendOtp } from "./send-otp.controller";

const otp = {checkVerification, resendOtp, sendOtp};
export default otp;