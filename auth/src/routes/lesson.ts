import express, { Router } from 'express';
import authenticateUser from '../middleware/authenticateUser';
import { createLesson, deleteLesson, updateLesson } from '../controllers/lesson';

const router: Router = express.Router();

router.post('/create', createLesson);
router.put('/update', updateLesson);
router.delete('/delete', deleteLesson);
router.get('/');
router.get('/lessons');

export default router;