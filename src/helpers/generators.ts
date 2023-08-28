import crypto from "crypto";
import OTP from "../models/OTP";
import Transaction from "../models/Transaction";
import { UserTypes } from "../utils/types";

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

export const tokenGenerator = (length: number) => {
    return crypto.randomBytes(length).toString("hex");
};

export const refGenerator = async (): Promise<string> => {
    const pre = "KLSN";
    const id = crypto.randomInt(100000, 999999);
    const ref = pre + id;
    const refExists = await Transaction.findOne({ ref: ref });
    if (refExists) {
        return refGenerator();
    }
    return ref;
};

export const createTokenUser = (user: UserTypes) => {
    return { name: user.name, userId: user._id, role: user.role };
};

export const transformPhone = (phone: string, code = "+234") => {
    phone.replace(/\s/g, "");
    const lastTen = phone.substring(phone.length - 10);
    const fullNumber = `${code}${lastTen}`;
    return fullNumber;
};
