import crypto from "crypto";
import { OTP } from "../models";

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
