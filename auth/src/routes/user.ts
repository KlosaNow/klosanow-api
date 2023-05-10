import express, { Router } from 'express';
import { getAllUsers } from '../controllers';

const router: Router = express.Router();

router.route('/get-users').get(getAllUsers);

export default router;