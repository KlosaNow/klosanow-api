import registerUser from "./auth/registerUser";
import loginUser from "./auth/loginUser";
import logoutUser from "./auth/logoutUser";
import verifyOTP from "./auth/verifyOTP";

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

import getAllChats from "./chat/getAllChats";
import getChatById from "./chat/getChatById";
import deleteChatById from "./chat/deleteChatById";

import createStudyChat from "./studyChat/createStudyChat";
import getAllStudyChats from "./studyChat/getAllStudyChats";
import getStudyChatById from "./studyChat/getStudyChatById";
import updateStudyChatById from "./studyChat/updateStudyChatById";
import deleteStudyChatById from "./studyChat/deleteStudyChatById";

import AIChatBotController from "./chatbot";

export {
	// Auth
	registerUser,
	loginUser,
	verifyOTP,
	logoutUser,

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
	getAllChats,
	getChatById,
	deleteChatById,

	// Study Chat
	createStudyChat,
	getAllStudyChats,
	getStudyChatById,
	updateStudyChatById,
	deleteStudyChatById,

	// AI Chatbot
	AIChatBotController,
};
