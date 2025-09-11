import express, { Router } from "express";

import {
	registerUser,
	verifyEmail,
	loginUser,
	logoutUser,
	resetPassword,
	forgotPassword,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router.route("/sign-up").post(registerUser);
router.route("/verify-email/:token").get(verifyEmail);
router.route("/sign-in").post(loginUser);
router.route("/sign-out").post(authenticateUser, logoutUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-passsword/:token").post(resetPassword);

export default router;
