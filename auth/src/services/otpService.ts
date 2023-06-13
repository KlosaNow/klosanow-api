import { otpGenerator } from '../helpers';
import { Infobip, AuthType } from "@infobip-api/sdk";
import debug from 'debug';
import {
  INFOBIP_BASE_URL,
  INFOBIP_API_KEY,
  INFOBIP_SENDER,
} from '../utils/config';

const debugLog: debug.IDebugger = debug('app');

let infobip = new Infobip({
  baseUrl: INFOBIP_BASE_URL!,
  apiKey: INFOBIP_API_KEY,
  authType: AuthType.ApiKey,
});

const sendOtpService = async (userId: string, to: string) => {
  const otp = await otpGenerator(userId);

  const response = await infobip.channels.sms.send({
    type: "text",
    messages: [
      {
        from: INFOBIP_SENDER,
        destinations: [
          {
            to: '2348137298342',
          },
        ],
        text: `Here is your one-time OTP: ${otp}`,
      },
    ],
  });

  debugLog(response);
  return otp;
};

export default sendOtpService;
