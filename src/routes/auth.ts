import express, { Router } from "express";

import { registerUser, loginUser, logoutUser, verifyOTP } from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router.route("/sign-up").post(registerUser);
router.route("/sign-in").post(loginUser);
router.route("/verify-otp/:token").post(verifyOTP);
router.route("/sign-out").post(authenticateUser, logoutUser);

export default router;
