import jwt from "jsonwebtoken";
import { UserType } from "./types";

export const createJWT = async (payload: UserType) => {
    const secret = process.env.JWT_SECRET!;
    const token = await jwt.sign(payload, secret);
    return token;
};

export const verifyJWT = (token: string): any =>
    jwt.verify(token, process.env.JWT_SECRET!);

export const generateRefreshToken = async (user: UserType) => {
    return createJWT(user);
};
