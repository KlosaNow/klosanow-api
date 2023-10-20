import express, { Router } from "express";

import { getChat, getAllChats, createChat, updateChat } from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router.route("/").get(authenticateUser, getAllChats);
router
    .route("/:recipient")
    .get(authenticateUser, getChat)
    .post(authenticateUser, createChat)
    .put(authenticateUser, updateChat);

export default router;
