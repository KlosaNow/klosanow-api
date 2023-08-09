import express, { Router } from 'express';
import {authenticateUser} from '../middleware/authenticateUser';
import {createBasicSubscription, createPremiumSubscription} from '../controllers/'

const router: Router = express.Router()

router.route('/make-basic-sub').post(createBasicSubscription)
router.route('/make-premium-sub').post(createPremiumSubscription)

export default router