import express, { Router } from "express";

import { getAllUsers, getUserById } from "../controllers";
import { authenticateAdminUser, authenticateUser } from "../middleware";

const router: Router = express.Router();

router
    .route("/users")
    .get(authenticateUser, authenticateAdminUser, getAllUsers);
router.route("/user/:id").get(authenticateUser, getUserById);

export default router;
