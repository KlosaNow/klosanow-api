import express, { Router } from 'express';
import authenticateUser from '../middleware/authenticateUser';
import { createLesson, deleteLesson, updateLesson, getLesson, getAllLessons } from '../controllers/lesson';

const router: Router = express.Router();

router.post('/create', createLesson);
router.put('/update', updateLesson);
router.delete('/delete', deleteLesson);
router.get('/', getLesson);
router.get('/lessons', getAllLessons);

export default router;