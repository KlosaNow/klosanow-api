import crypto from "crypto";
import { Token } from "../models";

const TOKEN_LENGTH = 32;

export const tokenGenerator = async (userId: string): Promise<string> => {
	const token = crypto.randomBytes(TOKEN_LENGTH).toString("hex");
	const tokenExists = await Token.findOne({ user: userId });
	if (tokenExists) {
		tokenExists.token = token;
		await tokenExists.save();
	} else {
		await Token.create({ token, user: userId });
	}

	return token;
};
