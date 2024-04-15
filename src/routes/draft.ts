import express, { Router } from "express";

import {
    createDraft,
    getAllDrafts,
    getDraftById,
    deleteDraftById,
    updateDraftById,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router
    .route("/")
    .get(authenticateUser, getAllDrafts)
    .post(authenticateUser, createDraft);

router
    .route("/:id")
    .get(authenticateUser, getDraftById)
    .patch(authenticateUser, updateDraftById)
    .delete(authenticateUser, deleteDraftById);

export default router;
