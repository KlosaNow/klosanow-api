import registerUser from "./auth/registerUser";
import verifyEmail from "./auth/verifyEmail";
import loginUser from "./auth/loginUser";
import logoutUser from "./auth/logoutUser";
import resetPassword from "./auth/resetPassword";
import forgotPassword from "./auth/forgotPassword";

import getAllUsers from "./user/getAllUsers";
import getUserById from "./user/getUserById";
import updateUserById from "./user/updateUserById";
import deleteUserById from "./user/deleteUserById";

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

import getAllChats from "./chat/getAllChats";
import getChatById from "./chat/getChatById";
import deleteChatById from "./chat/deleteChatById";

import createStudyChat from "./studyChat/createStudyChat";
import getAllStudyChats from "./studyChat/getAllStudyChats";
import getStudyChatById from "./studyChat/getStudyChatById";
import updateStudyChatById from "./studyChat/updateStudyChatById";
import deleteStudyChatById from "./studyChat/deleteStudyChatById";

import getStudyChatBySlug from "./studyChat/slug/getStudyChatBySlug";
import createStudyChatSlug from "./studyChat/slug/createStudyChatSlug";
import joinStudyChatViaSlug from "./studyChat/slug/joinStudyChatViaSlug";

import AIChatBotController from "./chatbot";

export {
	// Auth
	registerUser,
	verifyEmail,
	loginUser,
	logoutUser,
	resetPassword,
	forgotPassword,

	// User
	getAllUsers,
	getUserById,
	updateUserById,
	deleteUserById,

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
	getAllChats,
	getChatById,
	deleteChatById,

	// Study Chat
	createStudyChat,
	getAllStudyChats,
	getStudyChatById,
	updateStudyChatById,
	deleteStudyChatById,
	getStudyChatBySlug,
	createStudyChatSlug,
	joinStudyChatViaSlug,

	// AI Chatbot
	AIChatBotController,
};
