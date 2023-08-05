const User = require("../models/User");

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

      // OTP is sent here

      return res.status(201).json({
        status: "success",
        message: "Unverified user created successfully",
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

module.exports = { signUp, signIn };
