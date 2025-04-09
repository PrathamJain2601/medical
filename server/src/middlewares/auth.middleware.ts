import { NextFunction, Request, response, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.util";
import { prisma } from "../config/db.config";
import { responseCodes } from "../utils/response-codes.util";

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return responseCodes.clientError.unauthorized(res, "Unauthorized: No token provided");
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = verifyAccessToken(token);
        req.body.id = decoded.sub;
        req.body.isVerified = decoded.isVerified;
        if(req.body.isVerified == false){
            const user = await prisma.user.findUnique({
                select:{
                    isVerified:true
                },
                where: { id: decoded.sub },
            })
            if(!user){
                return responseCodes.clientError.notFound(res, "User not found");
            }
            req.body.isVerified = user.isVerified
        }

        if(req.body.isVerified == false){
            return responseCodes.clientError.unauthorized(res, "Unauthorized: Email not verified");
        }
        next();

    } catch (error) {
        console.log(error);
        return responseCodes.clientError.unauthorized(res, "Invalid or Expired token");
    }
}