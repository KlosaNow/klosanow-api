import express, { Router } from 'express';
import authenticateUser from '../middleware/authenticateUser';

const router: Router = express.Router();

router.post('/create', authenticateUser);
router.put('/update', authenticateUser);
router.delete('/delete', authenticateUser);
router.get('/', authenticateUser);
router.get('/lessons', authenticateUser);

export default router;