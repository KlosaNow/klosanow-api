import registerUser from "./auth/registerUser";
import loginUser from "./auth/loginUser";
import logoutUser from "./auth/logoutUser";
import verifyOTP from "./auth/verifyOTP";

import getAllUsers from "./user/getAllUsers";
import getUserById from "./user/getUserById";
import updateUserById from "./user/updateUserById";

export {
    // Auth
    registerUser,
    loginUser,
    verifyOTP,
    logoutUser,

    // User
    getAllUsers,
    getUserById,
    updateUserById,
};
