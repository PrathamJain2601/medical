import { Request, Response } from "express";
import { prisma } from "../../config/db.config";
import { responseCodes } from "../../utils/response-codes.util";

export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return responseCodes.clientError.unauthorized(res, "no refresh token found");
        }

        await prisma.session.deleteMany({
            where: {
                token: refreshToken
            }
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.setHeader("Authorization", "");

        return responseCodes.success.ok(res, "Logged out successfully")
    } catch (error) {
        console.log(error);
        return responseCodes.serverError.internalServerError(res, "Internal server error");
    }
};
