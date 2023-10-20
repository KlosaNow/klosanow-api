import registerUser from "./auth/registerUser";
import loginUser from "./auth/loginUser";
import verifyOTP from "./auth/verifyOTP";
import logout from "./auth/logout";

import getAllUsers from "./user/getAllUsers";
import getUserById from "./user/getUserById";
import updateUserData from "./user/updateUserData";

import getChat from "./chat/getChat";
import getAllChats from "./chat/getAllChats";
import createChat from "./chat/createChat";
import updateChat from "./chat/updateChat";
import deleteMessage from "./chat/deleteMessage";
import deleteChat from "./chat/deleteChat";

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
    getChat,
    getAllChats,
    createChat,
    updateChat,
    deleteChat,
    deleteMessage,
};
