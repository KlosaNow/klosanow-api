import express, { Router } from "express";
import multer from "multer";

import { deleteMedia, uploadMedia } from "../controllers";
import { authenticateUser, checkStorageLimit } from "../middleware";

const router: Router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router
    .route("/")
    .post(
        authenticateUser,
        upload.single("mediaFile"),
        checkStorageLimit,
        uploadMedia
    )
    .delete(authenticateUser, deleteMedia);

export default router;
