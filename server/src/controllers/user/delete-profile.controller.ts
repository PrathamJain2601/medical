import { Request, Response } from "express"
import { prisma } from "../../config/db.config";
import { responseCodes } from "../../utils/response-codes.util";

export const deleteProfile = async (req: Request, res: Response) => {
    try{
        const {id} = req.body;
        await prisma.user.delete({
            where: {
                id: id
            }
        });
        return responseCodes.success.ok(res, "Profile deleted successfully");
    }
    catch(e){
        console.log(e);
        responseCodes.serverError.internalServerError(res, "internal server error");
    }
}