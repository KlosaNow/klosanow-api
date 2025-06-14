import express, { Router } from "express";

import { AIChatBotController } from "../controllers/";

const router: Router = express.Router();

router.route("/chat").post(AIChatBotController);

export default router;
