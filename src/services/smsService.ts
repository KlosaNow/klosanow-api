import { infobip } from "./otpService";

import { INFOBIP_SENDER } from "../utils/config";

const sendSMS = async (phone: string, otp: number) => {
    return await infobip.channels.sms.send({
        type: "text",
        messages: [
            {
                from: INFOBIP_SENDER,
                destinations: [
                    {
                        to: phone,
                    },
                ],
                text: `Here is your one-time OTP: ${otp}`,
            },
        ],
    });
};

export default sendSMS;
