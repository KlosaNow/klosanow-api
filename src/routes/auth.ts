import express, { Router } from 'express';
import { registerUser, loginUser, verifyOTP, logout } from '../controllers';
import {authenticateUser, authenticateUser3} from '../middleware/authenticateUser';

const router: Router = express.Router();

router.route("/sign-up").post(registerUser);
router.route("/sign-in").post(loginUser);
router.route("/verify-otp").post(authenticateUser, verifyOTP);
router.route("/logout").post(authenticateUser, logout);

export default router;
