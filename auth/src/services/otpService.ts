import { otpGenerator } from '../helpers';
import { Infobip, AuthType } from "@infobip-api/sdk";
import debug from 'debug';
import {
  INFOBIP_BASE_URL,
  INFOBIP_API_KEY,
  INFOBIP_SENDER,
} from '../utils/config';

const debugLog: debug.IDebugger = debug('app');

const transformPhone = (phone: string) => {
  if (phone.startsWith('0')) {
    return `234${phone.slice(1)}`;
  }
  return phone.slice(1);
}

let infobip = new Infobip({
  baseUrl: INFOBIP_BASE_URL!,
  apiKey: INFOBIP_API_KEY,
  authType: AuthType.ApiKey,
});

const sendOtpService = async (userId: string, to: string) => {
  const phone = transformPhone(to);
  const otp = await otpGenerator(userId);

  // const response = await infobip.channels.sms.send({
  //   type: "text",
  //   messages: [
  //     {
  //       from: INFOBIP_SENDER,
  //       destinations: [
  //         {
  //           to: phone,
  //         },
  //       ],
  //       text: `Here is your one-time OTP: ${otp}`,
  //     },
  //   ],
  // });

  const response = await infobip.channels.email.send({
    to: 'anselemcloud@gmail.com',
    from: 'anselemcloud@gmail.com',
    text: `Here is your one-time OTP: ${otp}`,
    subject: 'Testing'

    // email: [
    //   {
    //     from: 'anselemcloud@gmail.com',
    //     destinations: [
    //       {
    //         to: 'anselemodims@gmail.com',
    //       },
    //     ],
    //     text: `Here is your one-time OTP: ${otp}`,
    //     subject: 'Testing'
    //   },
    // ],
  });

  debugLog(response.data);
  return otp;
};

export default sendOtpService;
