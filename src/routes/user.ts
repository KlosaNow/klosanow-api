import express, { Router } from "express";

import { getAllUsers, getUserById, updateUserData } from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router
	.route("/")
	.get(authenticateUser, getAllUsers)
	.put(authenticateUser, updateUserData);
router.route("/:id").get(authenticateUser, getUserById);

export default router;
