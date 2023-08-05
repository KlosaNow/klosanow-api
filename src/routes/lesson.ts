import express, { Router } from 'express';
import multer from 'multer'
import {authenticateUser} from '../middleware/authenticateUser'
import { createLesson, deleteLesson, updateLesson, getLesson, getAllLessons } from '../controllers/lesson';

const router: Router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({storage})

router.post('/create', upload.single('videoUrl'), createLesson);
router.put('/update', updateLesson);
router.delete('/delete', deleteLesson);
router.get('/', getLesson);
router.get('/lessons', getAllLessons);

export default router;