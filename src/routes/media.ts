import express, { Router } from "express";
import multer from "multer";

import { deleteVideo, uploadVideo } from "../controllers";
import { authenticateUser, checkStorageLimit } from "../middleware";

const router: Router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .route("/")
  .post(
    authenticateUser,
    upload.single("videoFile"),
    checkStorageLimit,
    uploadVideo
  )
  .delete(authenticateUser, deleteVideo);

export default router;
