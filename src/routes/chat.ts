import express, { Router } from "express";

import { getAllChats, getChatById, deleteChatById } from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router.route("/").get(authenticateUser, getAllChats);

router
	.route("/:id")
	.get(authenticateUser, getChatById)
	.delete(authenticateUser, deleteChatById);

export default router;
