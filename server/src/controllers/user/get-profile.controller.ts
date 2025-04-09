import { Request, Response } from "express"
import { prisma } from "../../config/db.config"
import { responseCodes } from "../../utils/response-codes.util";

export const getProfile = async (req: Request, res: Response) => {
    const {id} = req.body;
    try{
        const user = await prisma.user.findUnique({
            select:{
                name: true,
                id: true,
                email: true,
                username: true,
                avatar: true,
                isVerified: true,
                updatedAt: true,
                createdAt: true,
                role: true,
                company: true
            },
            where:{
                id: id
            }
        })
        if(!user){
            return responseCodes.serverError.internalServerError(res, "User not found some internal error");
        }
        return responseCodes.success.ok(res, user, "user fetched");
    }
    catch(e){
        console.log(e);
        return responseCodes.serverError.internalServerError(res, "internal server error");
    }
}