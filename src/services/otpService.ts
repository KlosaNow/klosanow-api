import { otpGenerator } from "../helpers";
import { Infobip, AuthType } from "@infobip-api/sdk";

import sendEmail from "./emailService";
import sendSMS from "./smsService";
import { INFOBIP_BASE_URL, INFOBIP_API_KEY } from "../utils/config";

const transformPhone = (phone: string) => {
    if (phone.startsWith("0")) {
        return `234${phone.slice(1)}`;
    }
    return phone.slice(1);
};

export const infobip = new Infobip({
    baseUrl: INFOBIP_BASE_URL!,
    apiKey: INFOBIP_API_KEY,
    authType: AuthType.ApiKey,
});

const sendOtpService = async (userId: string, to: string, email: string) => {
    const phone = transformPhone(to);
    const otp = await otpGenerator(userId);

    await sendSMS(phone, otp);
    await sendEmail(email, otp);

    return otp;
};

export default sendOtpService;
