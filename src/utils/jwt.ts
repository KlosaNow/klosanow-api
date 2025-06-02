import jwt from "jsonwebtoken";
import { JWTPayloadType } from "./types";

export const createJWT = (payload: JWTPayloadType) => {
	const secret = process.env.JWT_SECRET!;
	const token = jwt.sign(payload, secret);
	return token;
};

export const verifyJWT = (token: string): any =>
	jwt.verify(token, process.env.JWT_SECRET!);

export const generateRefreshToken = async (user: JWTPayloadType) => {
	return createJWT(user);
};
