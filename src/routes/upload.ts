import express, { Router } from 'express';
import multer from 'multer'

import {authenticateUser} from '../middleware/authenticateUser';
import uploadFileHandler from '../controllers/uploads/uploadFile';

const router: Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage})

router.post('/', authenticateUser, upload.single('file'), uploadFileHandler);

export default router;