import express, { Router } from "express";

import {
    getAllChats,
    getChatById,
    sendMessage,
    deleteChatById,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router
    .route("/")
    .get(authenticateUser, getAllChats)
    .post(authenticateUser, sendMessage);
router
    .route("/:id")
    .get(authenticateUser, getChatById)
    .post(authenticateUser, sendMessage)
    .delete(authenticateUser, deleteChatById);

export default router;
