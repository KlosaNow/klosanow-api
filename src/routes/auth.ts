import express, { Router } from "express";

import { registerUser, loginUser, logoutUser } from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router.route("/sign-up").post(registerUser);
router.route("/sign-in").post(loginUser);
router.route("/sign-out").post(authenticateUser, logoutUser);

export default router;
