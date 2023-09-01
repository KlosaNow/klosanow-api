import express, { Router } from "express";
import { getAllUsers, getUserById, getUserByEmail } from "../controllers";

const router: Router = express.Router();

router.route("/get-users").get(getAllUsers);
router.route("/get-user/:id").get(getUserById);
router.route("/get-user").get(getUserByEmail);

export default router;
