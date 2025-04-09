import bcrypt from "bcrypt";
const hashPassword = async (password: string)=>{
    const hash = await bcrypt.hash(password, 5);
    return hash;
}

const verifyPassword = async (password: string, hashPassword: string) => {
    const result = await bcrypt.compare(password.toString(), hashPassword.toString());
    return result;
}

export {hashPassword, verifyPassword};
