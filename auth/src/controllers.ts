import { Request, Response } from "express";

import { OTP, AuthToken } from "./models";

import {
  otpGenerator,
  authTokenGenerator,
  createUserRequest,
  getUserByEmailRequest,
} from "./helpers";

require("dotenv").config();

export const signUp = async (req: Request, res: Response) => {
  try {
    const emailAlreadyExists = await getUserByEmailRequest(
      req.body.emailAddress
    );
    if (emailAlreadyExists) {
      return res.status(400).json({
        status: "error",
        message: "User with that email already exists",
      });
    } else {
      const newUser = await createUserRequest(req.body);

      const newOtp = new OTP({
        user: newUser._id,
        otp: await otpGenerator(),
      });
      await newOtp.save();

      const newAuthToken = new AuthToken({
        user: newUser._id,
        token: await authTokenGenerator(),
      });
      await newAuthToken.save();

      // Send the otp here

      return res.status(201).json({
        status: "success",
        data: { "auth token": newAuthToken.token },
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const user = await getUserByEmailRequest(req.body.emailAddress);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email address",
      });
    } else {
      // Send OTP or JWT

      return res.status(200).json({
        status: "success",
        data: "**jwt** or **auth token**",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const otp = req.body.otp;
    const otpExists = await OTP.findOne({ otp });
    if (!otpExists) {
      return res.status(401).json({
        status: "error",
        message: "Invalid one-time password",
      });
    } else {
      const authTokenExists = await AuthToken.findOne({
        token: req.params.authToken,
      });
      if (!authTokenExists) {
        return res.status(401).json({
          status: "error",
          // message: "Invalid authentication token",
          message: "Authentication failed",
        });
      } else if (authTokenExists.user.equals(otpExists.user)) {
        return res.status(200).json({
          status: "success",
          data: { token: "JWT is implemented here" },
        });
      } else {
        return res.status(401).json({
          status: "error",
          message: "Authentication failed",
        });
      }
    }
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
