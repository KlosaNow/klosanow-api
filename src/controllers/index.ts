import registerUser from "./auth/registerUser";
import loginUser from "./auth/loginUser";
import logoutUser from "./auth/logoutUser";
import verifyOTP from "./auth/verifyOTP";

import getAllUsers from "./user/getAllUsers";
import getUserById from "./user/getUserById";
import updateUserById from "./user/updateUserById";

import createLesson from "./lesson/createLesson";
import deleteLessonById from "./lesson/deleteLessonById";
import getAllLessons from "./lesson/getAllLessons";
import getLessonById from "./lesson/getLessonById";
import updateLessonById from "./lesson/updateLessonById";

import createDraft from "./draft/createDraft";
import deleteDraftById from "./draft/deleteDraftById";
import getAllDrafts from "./draft/getAllDrafts";
import getDraftById from "./draft/getDraftById";
import updateDraftById from "./draft/updateDraftById";

import deleteMedia from "./media/deleteMedia";
import uploadMedia from "./media/uploadMedia";

import socketControllers from "./chat/socketControllers";

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

    // Lesson
    createLesson,
    getAllLessons,
    getLessonById,
    deleteLessonById,
    updateLessonById,

    // Draft
    createDraft,
    getAllDrafts,
    getDraftById,
    deleteDraftById,
    updateDraftById,

    // Media
    deleteMedia,
    uploadMedia,

    // Chat
    socketControllers,
};
