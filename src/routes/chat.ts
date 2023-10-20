import express, { Router } from "express";

import {
    getChat,
    getAllChats,
    createChat,
    updateChat,
    deleteMessage,
    deleteChat,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router.route("/").get(authenticateUser, getAllChats);
router
    .route("/:recipient")
    .get(authenticateUser, getChat)
    .post(authenticateUser, createChat)
    .put(authenticateUser, updateChat)
    .delete(authenticateUser, deleteChat);
router.route("/message/:recipient").delete(authenticateUser, deleteMessage);

export default router;
