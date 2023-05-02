import crypto from 'crypto';
import OTP from '../models/OTP';
import { otpGenerator } from '../helpers';
import debug from 'debug';
import {
  TWILIO_PHONE_NUMBER,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
} from '../utils/config';
import twilio from 'twilio';

const debugLog: debug.IDebugger = debug('app');

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendOtpService = async (userId: string, to: string) => {
  const otp = await otpGenerator(userId);

  const message = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: TWILIO_PHONE_NUMBER,
    to,
  });

  debugLog(message);
  return otp;
};

export default sendOtpService;
