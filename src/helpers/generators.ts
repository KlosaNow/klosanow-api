import crypto from "crypto";
import { OTP, Token } from "../models";

const TOKEN_LENGTH = 32;

export const otpGenerator = async (userId: string): Promise<number> => {
    const otp = crypto.randomInt(1000, 10000);
    const otpExists = await OTP.findOne({ user: userId });
    if (otpExists) {
        otpExists.otp = otp;
        await otpExists.save();
    } else {
        await OTP.create({ otp, user: userId });
    }

    return otp;
};

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
