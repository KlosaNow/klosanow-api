import express, { Router } from "express";

import {
	createStudyChat,
	getAllStudyChats,
	getStudyChatById,
	updateStudyChatById,
	deleteStudyChatById,
	getStudyChatBySlug,
	createStudyChatSlug,
	joinStudyChatViaSlug,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router
	.route("/")
	.get(authenticateUser, getAllStudyChats)
	.post(authenticateUser, createStudyChat);

router.route("/slug").post(authenticateUser, createStudyChatSlug);

router
	.route("/slug/:slug")
	.get(authenticateUser, getStudyChatBySlug)
	.post(authenticateUser, joinStudyChatViaSlug);

router
	.route("/:id")
	.get(authenticateUser, getStudyChatById)
	.put(authenticateUser, updateStudyChatById)
	.delete(authenticateUser, deleteStudyChatById);

export default router;
