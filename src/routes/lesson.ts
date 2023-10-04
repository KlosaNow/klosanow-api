import express, { Router } from "express";
import multer from "multer";

import {
    createLesson,
    deleteLessonById,
    getAllLessons,
    getLessonById,
    updateLessonById,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router
    .route("/")
    .get(getAllLessons)
    .post(authenticateUser, upload.single("videoUrl"), createLesson);
router
    .route("/:id")
    .get(getLessonById)
    .put(authenticateUser, updateLessonById)
    .delete(authenticateUser, deleteLessonById);

export default router;
