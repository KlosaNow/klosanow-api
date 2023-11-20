import express, { Router } from "express";

import {
    createLesson,
    getAllLessons,
    getLessonById,
    deleteLessonById,
    updateLessonById,
} from "../controllers";
import { authenticateUser, checkStorageLimit } from "../middleware";

const router: Router = express.Router();

router
    .route("/")
    .get(getAllLessons)
    .post(authenticateUser, checkStorageLimit, createLesson);

router
    .route("/:id")
    .get(getLessonById)
    .put(authenticateUser, updateLessonById)
    .delete(authenticateUser, deleteLessonById);

export default router;
