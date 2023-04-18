const User = require("./models");

require("dotenv").config();

const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json({
      status: "success",
      data: allUsers,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ emailAddress: req.params.emailAddress });
    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, emailAddress, phoneNumber, password } = req.body;
    const emailAlreadyExists = await User.findOne({ emailAddress });
    if (emailAlreadyExists) {
      return res.status(400).json({
        status: "error",
        message: "User with that email already exists",
      });
    } else {
      const newUser = new User({
        username,
        emailAddress,
        phoneNumber,
        password,
      });
      await newUser.save();
      return res.status(201).json({
        status: "success",
        data: newUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = { getUsers, getUserByEmail, createUser };
