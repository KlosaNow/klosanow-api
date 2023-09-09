import registerUser from "./auth/registerUser";
import loginUser from "./auth/loginUser";
import verifyOTP from "./auth/verifyOTP";
import logout from "./auth/logout";

import getAllUsers from "./user/getAllUsers";
import getUserById from "./user/getUserById";
import getUserByEmail from "./user/getUserByEmail";

export {
    // Auth
    registerUser,
    loginUser,
    verifyOTP,
    logout,

    // User
    getAllUsers,
    getUserById,
    getUserByEmail,
};
