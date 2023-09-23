import express, { Router } from "express";

import { registerUser, loginUser, verifyOTP, logout } from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router.route("/sign-up").post(registerUser);
router.route("/sign-in").post(loginUser);
router.route("/verify-otp/:token").post(verifyOTP);
router.route("/logout").post(authenticateUser, logout);

export default router;
