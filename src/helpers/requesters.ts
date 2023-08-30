import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getUserByEmailRequest = async (userEmail: string) => {
    try {
        const response = await axios.get(
            `${process.env.GATEWAY_URL}${process.env.USER_SERVICE_PATH}/${userEmail}`
        );
        return await response.data.data;
    } catch (error) {
        return error;
    }
};

export const createUserRequest = async (userData: Object) => {
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
