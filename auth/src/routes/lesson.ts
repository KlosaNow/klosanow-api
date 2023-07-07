import express, { Router } from 'express';
import authenticateUser from '../middleware/authenticateUser';
import { createLesson, deleteLesson } from '../controllers/lesson';

const router: Router = express.Router();

router.post('/create', authenticateUser, createLesson);
router.put('/update', authenticateUser);
router.delete('/delete', authenticateUser, deleteLesson);
router.get('/', authenticateUser);
router.get('/lessons', authenticateUser);

export default router;