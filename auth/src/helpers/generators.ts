import crypto from "crypto";
import { OTP, AuthToken } from "../models";

export const otpGenerator = async (): Promise<number> => {
  const otp = crypto.randomInt(1000, 10000); // geneate a number a four digit number
  if (await OTP.findOne({ otp })) {
    // generate a new otp if the generated otp has been used
    return otpGenerator();
  } else {
    return otp;
  }
};

export const authTokenGenerator = async (): Promise<string> => {
  const LENGTH_OF_TOKEN = 32;
  const CHARACTERS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < LENGTH_OF_TOKEN; i++) {
    token += CHARACTERS.charAt(crypto.randomInt(0, 62));
  }
  if (await AuthToken.findOne({ token })) {
    // generate a new token if the generated token has been used
    return authTokenGenerator();
  } else {
    return token;
  }
};
