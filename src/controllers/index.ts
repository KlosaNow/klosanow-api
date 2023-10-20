import registerUser from "./auth/registerUser";
import loginUser from "./auth/loginUser";
import verifyOTP from "./auth/verifyOTP";
import logout from "./auth/logout";

import getAllUsers from "./user/getAllUsers";
import getUserById from "./user/getUserById";
import updateUserData from "./user/updateUserData";

import getAllChats from "./chat/getAllChats";
import getChatById from "./chat/getChatById";
import deleteChatById from "./chat/deleteChatByid";
import sendMessage from "./chat/message/sendMessage";

export {
    // Auth
    registerUser,
    loginUser,
    verifyOTP,
    logout,

    // User
    getAllUsers,
    getUserById,
    updateUserData,

    // Chats
    getAllChats,
    getChatById,
    sendMessage,
    deleteChatById,
};
