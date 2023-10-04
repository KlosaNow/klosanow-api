import express, { Router } from "express";

import { getAllUsers, getUserById, updateUserById } from "../controllers";
import { authenticateAdminUser, authenticateUser } from "../middleware";

const router: Router = express.Router();

router.route("/").get(authenticateUser, authenticateAdminUser, getAllUsers);
router
    .route("/:id")
    .get(authenticateUser, getUserById)
    .put(authenticateUser, updateUserById);

export default router;
