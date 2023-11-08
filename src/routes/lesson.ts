import express, { Router } from "express";

import {
  createLesson,
  getAllLessons,
  getLessonById,
  deleteLessonById,
  updateLessonById,
} from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();

router.route("/").get(getAllLessons).post(authenticateUser, createLesson);

router
  .route("/:id")
  .get(getLessonById)
  .put(authenticateUser, updateLessonById)
  .delete(authenticateUser, deleteLessonById);

export default router;
