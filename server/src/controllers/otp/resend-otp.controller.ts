import { Request, response, Response } from "express"
import { responseCodes } from "../../utils/response-codes.util";
import { sendToQueue } from "../../utils/email.util";
import { createVerificationToken } from "../../utils/jwt.util";
import { prisma } from "../../config/db.config";

export const resendOtp = async (req: Request, res: Response) => {
    const {email} = req.body;
    if(!email){
        return responseCodes.clientError.badRequest(res, "Email is required");
    }
    try{
        const user = await prisma.user.findUnique({
            where:{
                email: email
            }
        });
        if(!user){
            return responseCodes.clientError.notFound(res, "User not found");
        }
        const code = createVerificationToken(user.email);
        sendToQueue({
            to: user.email,
            subject: "Welcome to Auth | Email verification Link",
            name: user.name,
            code: code
        });
        return responseCodes.success.ok(res, null, "Email verification code sent successfully");
    }
    catch(error){
        console.log(error);
        return responseCodes.serverError.internalServerError(res, "Internal server error");
    }
}