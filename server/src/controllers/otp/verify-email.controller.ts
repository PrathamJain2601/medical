import { Request, Response } from "express";
import { prisma } from "../../config/db.config";
import { verifyVerificationToken } from "../../utils/jwt.util";
import { responseCodes } from "../../utils/response-codes.util";
import { emailTemplates } from "../../utils/email-templates.util";

function isError(error: any): error is Error {
    return error instanceof Error;
}

const verifyEmail = async (req: Request, res: Response): Promise<void> => { 
    const { token } = req.query;

    if (!token) {
        res.status(400).send(emailTemplates.renderResponse("Token is required", false));
        return;
    }

    try {
        const decoded = verifyVerificationToken(token as string);
        const email = decoded.sub; 

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            res.status(404).send(emailTemplates.renderResponse("User not found", false));
            return;
        }

        if (user.isVerified) {
            res.status(400).send(emailTemplates.renderResponse("Email already verified", false));
            return;
        }

        const otpRecord = await prisma.otp.findFirst({
            where: { email: user.email },
            orderBy: { createdAt: 'desc' },  
        });

        if (!otpRecord) {
            res.status(400).send(emailTemplates.renderResponse("OTP not found", false));
            return;
        }

        const currentTime = new Date();
        const otpExpirationTime = otpRecord.createdAt.getTime() + 10 * 60 * 1000;

        if (currentTime.getTime() > otpExpirationTime) {
            res.status(400).send(emailTemplates.renderResponse("OTP has expired", false));
            return;
        }

        await prisma.user.update({
            where: { email: email },
            data: { isVerified: true },
        });

        await prisma.otp.delete({
            where: { id: otpRecord.id },
        });

        res.status(200).send(emailTemplates.renderResponse("Email successfully verified!", true));
    } catch (error) {
        if (isError(error) && error.name === "TokenExpiredError") {
            res.status(400).send(emailTemplates.renderResponse("Token has expired", false));
        } else {
            console.error("Error verifying email: ", error);
            res.status(500).send(emailTemplates.renderResponse("An error occurred while verifying the email", false));
        }
    }
};

export { verifyEmail };
