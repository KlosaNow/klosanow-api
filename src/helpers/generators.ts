import crypto from "crypto";
import { StudyChat, Token } from "../models";

const TOKEN_LENGTH = 32;
const SLUG_LENGTH = 16;

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

export const slugGenerator = async (): Promise<string> => {
	const slug = crypto.randomBytes(SLUG_LENGTH).toString("hex");
	const slugExists = await StudyChat.findOne({ slug });
	if (slugExists) {
		return await slugGenerator();
	} else {
		return slug;
	}
};
