import express, { Router } from "express";

import {
	createLesson,
	getAllLessons,
	getLessonById,
	deleteLessonById,
	updateLessonById,
	// Saved
	saveLesson,
	unsaveLesson,
	getSavedLessons,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router.route("/").get(getAllLessons).post(authenticateUser, createLesson);
router
	.route("/saved")
	.get(getSavedLessons)
	.post(saveLesson)
	.delete(unsaveLesson);

router
	.route("/:id")
	.get(getLessonById)
	.put(authenticateUser, updateLessonById)
	.delete(authenticateUser, deleteLessonById);

export default router;
