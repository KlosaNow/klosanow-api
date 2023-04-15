const User = require("../models/User");

require("dotenv").config();

const viewAllUsers = async (req, res) => {
  try {
    return res.status(200).json({
      status: "success",
      data: ["**All user objects**"],
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = { viewAllUsers };
