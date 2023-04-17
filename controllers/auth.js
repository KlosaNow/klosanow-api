const User = require("../models/User");
const { OTP, AuthToken } = require("../models/Auth");

const { otpGenerator, authTokenGenerator } = require("../helpers/generators");

require("dotenv").config();

const signUp = async (req, res) => {
  try {
    const emailAlreadyExists = await User.findOne({
      emailAddress: req.body.emailAddress,
    });
    if (emailAlreadyExists) {
      return res.status(400).json({
        status: "error",
        message: "User with that email already exists",
      });
    } else {
      const { username, emailAddress, phoneNumber, password } = req.body;
      const newUser = new User({
        username,
        emailAddress,
        phoneNumber,
        password,
      });
      await newUser.save();

      const newOtp = new OTP({
        user: newUser.id,
        otp: await otpGenerator(),
      });
      await newOtp.save();

      const newAuthToken = new AuthToken({
        user: newUser.id,
        token: await authTokenGenerator(),
      });
      await newAuthToken.save();

      // Send the otp here
      // console.log(newOtp.otp);

      return res.status(201).json({
        status: "success",
        message: "OTP sent successfully",
        data: { "auth token": newAuthToken.token },
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const signIn = async (req, res) => {
  try {
    const user = await User.findOne({ emailAddress: req.body.emailAddress });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    } else {
      if (user.isVerified) {
        // JWT is implemented here

        return res.status(200).json({
          status: "success",
          data: "**jwt token**",
        });
      } else {
        return res.status(401).json({
          status: "error",
          message: "Unverified users cannot login",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const verifyUser = async (req, res) => {
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
        // check if the user encoded in the
        // auth token is the same with the otp

        await User.findOneAndUpdate({ id: otpExists }, { isVerified: true }); // update user verification status

        return res.status(200).json({
          status: "success",
          data: { "JWT token": "JWT is implemented here" },
        });
      } else {
        return res.status(401).json({
          status: "error",
          message: "Authentication failed",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = { signUp, signIn, verifyUser };
