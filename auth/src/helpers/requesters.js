const axios = require("axios");
require("dotenv").config();

const getUserByEmailRequest = async (userEmail) => {
  try {
    const response = await axios.get(
      `${process.env.GATEWAY_URL}${process.env.USER_SERVICE_PATH}/${userEmail}`
    );
    return await response.data.data;
  } catch (error) {
    return error;
  }
};

const createUserRequest = async (userData) => {
  try {
    const response = await axios.post(
      `${process.env.GATEWAY_URL}${process.env.USER_SERVICE_PATH}`,
      userData
    );
    return await response.data.data;
  } catch (error) {
    return error;
  }
};

module.exports = { getUserByEmailRequest, createUserRequest };
