import { Request, Response } from "express"
import { responseCodes } from "../../utils/response-codes.util";
import { createAccessToken, verifyRefreshToken } from "../../utils/jwt.util";
import { prisma } from "../../config/db.config";

export const refreshAccessToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return responseCodes.clientError.unauthorized(res, "Refresh token is required");
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded || !decoded.sub) {
            return responseCodes.clientError.unauthorized(res, "Invalid refresh token");
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.sub },
        });

        if (!user) {
            return responseCodes.clientError.notFound(res, "User not found");
        }

        const newAccessToken = createAccessToken(user.id, user.isVerified);

        res.setHeader("Authorization", `Bearer ${newAccessToken}`);

        return responseCodes.success.ok(res, null, "New access token generated successfully");
    } catch (error) {
        console.log(error);
        return responseCodes.serverError.internalServerError(res, "Internal server error");
    }
}