import registerUser from "./auth/registerUser";
import loginUser from "./auth/loginUser";
import logoutUser from "./auth/logoutUser";
import resetPassword from "./auth/resetPassword";
import forgotPassword from "./auth/forgotPassword";

import getAllUsers from "./user/getAllUsers";
import getUserById from "./user/getUserById";
import updateUserData from "./user/updateUserData";

import createLesson from "./lesson/createLesson";
import deleteLessonById from "./lesson/deleteLessonById";
import getAllLessons from "./lesson/getAllLessons";
import getLessonById from "./lesson/getLessonById";
import updateLessonById from "./lesson/updateLessonById";

import saveLesson from "./lesson/saved/saveLesson";
import unsaveLesson from "./lesson/saved/unsaveLesson";
import getSavedLessons from "./lesson/saved/getSavedLessons";

import createDraft from "./draft/createDraft";
import deleteDraftById from "./draft/deleteDraftById";
import getAllDrafts from "./draft/getAllDrafts";
import getDraftById from "./draft/getDraftById";
import updateDraftById from "./draft/updateDraftById";

import deleteMedia from "./media/deleteMedia";
import uploadMedia from "./media/uploadMedia";

import ChatSocketControllers from "./chat/socketControllers";
import StudyChatSocketControllers from "./studyChat/socketControllers";

export {
	// Auth
	registerUser,
	loginUser,
	logoutUser,
	resetPassword,
	forgotPassword,

	// User
	getAllUsers,
	getUserById,
	updateUserData,

	// Lesson
	createLesson,
	getAllLessons,
	getLessonById,
	deleteLessonById,
	updateLessonById,

	// Saved
	saveLesson,
	unsaveLesson,
	getSavedLessons,

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
	ChatSocketControllers,

	// Study Chat
	StudyChatSocketControllers,
};
