import express, { Router } from 'express';
import { getAllUsers, getUserById } from '../controllers';

const router: Router = express.Router();

router.route('/get-users').get(getAllUsers);
router.route('/get-user/:id').get(getUserById);

export default router;