import express, { Router } from "express";
import multer from "multer";

import { deleteVideo, uploadVideo } from "../controllers";
import { authenticateUser } from "../middleware";

const router: Router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .route("/")
  .post(authenticateUser, upload.single("videoUrl"), uploadVideo)
  .delete(authenticateUser, deleteVideo);

export default router;
