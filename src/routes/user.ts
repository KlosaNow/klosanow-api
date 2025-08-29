import express, { Router } from "express";

import {
	getAllUsers,
	getUserById,
	updateUserById,
	deleteUserById,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router.route("/").get(authenticateUser, getAllUsers);
router
	.route("/:id")
	.get(authenticateUser, getUserById)
	.put(authenticateUser, updateUserById)
	.delete(authenticateUser, deleteUserById);

export default router;
