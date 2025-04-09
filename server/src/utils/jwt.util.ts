import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createRefreshToken = (id: string) => {
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    if(!REFRESH_TOKEN_SECRET){
        throw new Error("Missing REFRESH_TOKEN_SECRET in environment variables.");
    }
    const token = jwt.sign({sub: id}, REFRESH_TOKEN_SECRET, {expiresIn: "30d"});
    return token;
}

const createAccessToken = (id: string, isVerified: boolean) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    if(!ACCESS_TOKEN_SECRET){
        throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables.");
    }
    const token = jwt.sign({sub: id, isVerified: isVerified}, ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
    const decoded = jwt.decode(token, { complete: true });
    console.log(decoded);
    return token;
}

const createVerificationToken = (id: string) => {
    const VERIFICATION_TOKEN_SECRET = process.env.VERIFICATION_TOKEN_SECRET;
    if(!VERIFICATION_TOKEN_SECRET){
        throw new Error("Missing VERIFICATION_TOKEN_SECRET in environment variables.");
    }
    const token = jwt.sign({sub: id}, VERIFICATION_TOKEN_SECRET, {expiresIn: "1d"});
    return token;
}

const verifyRefreshToken = (token: string) => {
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    if(!REFRESH_TOKEN_SECRET){
        throw new Error("Missing REFRESH_TOKEN_SECRET in environment variables.");
    }
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { sub: string };
    return decoded;
}

const verifyAccessToken = (token: string) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    if(!ACCESS_TOKEN_SECRET){
        throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables.");
    }
    console.log(token);
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as {sub: string, isVerified: boolean};
    return decoded;
}

const verifyVerificationToken = (token: string) => {
    const VERIFICATION_TOKEN_SECRET = process.env.VERIFICATION_TOKEN_SECRET;
    if(!VERIFICATION_TOKEN_SECRET){
        throw new Error("Missing VERIFICATION_TOKEN_SECRET in environment variables.");
    }
    const decoded = jwt.verify(token, VERIFICATION_TOKEN_SECRET) as { sub: string };
    return decoded;
}

export {createRefreshToken, createAccessToken, verifyAccessToken, verifyRefreshToken, createVerificationToken, verifyVerificationToken};