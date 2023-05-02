import express, { Router } from 'express';
import { registerUser, loginUser, verifyOTP } from './controllers';
import authenticateUser from './middleware/authenticateUser';

const router: Router = express.Router();

router
  .route('/sign-up')
  .post(registerUser);
router.route('/sign-in').post(loginUser);
router.route('/verify-otp').post(authenticateUser, verifyOTP);

export default router;
