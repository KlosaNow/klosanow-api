import express, { Router } from "express";

import {
	createStudyChat,
	getAllStudyChats,
	getStudyChatById,
	updateStudyChatById,
	deleteStudyChatById,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router
	.route("/")
	.get(authenticateUser, getAllStudyChats)
	.post(authenticateUser, createStudyChat);

router
	.route("/:id")
	.get(authenticateUser, getStudyChatById)
	.put(authenticateUser, updateStudyChatById)
	.delete(authenticateUser, deleteStudyChatById);

export default router;
