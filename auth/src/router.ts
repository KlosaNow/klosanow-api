import express, { Router } from 'express';
import { registerUser } from './controllers';

const router: Router = express.Router();

router
  .route('/sign-up')
  .post(registerUser);
// router.route('/sign-in').post(signIn);
// router.route('/verify-user/:authToken').post(verifyUser);

export default router;
