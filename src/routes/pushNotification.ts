import express, { Router } from "express";

import {
	getVapidPublicKey,
	saveSubscription,
	deleteSubscription,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router.route("/vapid-public-key").get(authenticateUser, getVapidPublicKey);

router
	.route("/subscribe")
	.post(authenticateUser, saveSubscription)
	.delete(authenticateUser, deleteSubscription);

export default router;
