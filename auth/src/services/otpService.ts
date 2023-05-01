import crypto from 'crypto';
import OTP from '../models/OTP';
import { otpGenerator } from '../helpers';
import debug from 'debug';

const debugLog: debug.IDebugger = debug('app');

const sendOtpService = async (userId: string) => {
    const otp = await otpGenerator(userId);
    debugLog(`OTP: ${otp}`);
    return otp
}

export default sendOtpService;