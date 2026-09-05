import express, { Router } from "express";

import {
	createLesson,
	getAllLessons,
	getLessonById,
	deleteLessonById,
	updateLessonById,
	generateSlides,
	// Saved
	saveLesson,
	unsaveLesson,
	getSavedLessons,
} from "../controllers";
import { authenticateUser, uploadDocument } from "../middleware";

const router: Router = express.Router();

router.use(authenticateUser);

router.route("/").get(getAllLessons).post(createLesson);
router
	.route("/saved")
	.get(getSavedLessons)
	.post(saveLesson)
	.delete(unsaveLesson);

router.route("/generate-slides").post(uploadDocument, generateSlides);

router
	.route("/:id")
	.get(getLessonById)
	.put(updateLessonById)
	.delete(deleteLessonById);

export default router;
