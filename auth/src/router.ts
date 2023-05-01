import express, { Router } from 'express';
import { signUp, signIn, verifyUser } from './controllers/controllers';
import {
  requiredFieldsValidator,
  emailValidator,
  phoneNumberValidator,
} from './helpers';

const router: Router = express.Router();

router
  .route('/sign-up')
  .post(requiredFieldsValidator, emailValidator, phoneNumberValidator, signUp);
router.route('/sign-in').post(signIn);
router.route('/verify-user/:authToken').post(verifyUser);

export default router;
