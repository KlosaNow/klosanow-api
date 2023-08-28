import express, { Router } from 'express';
import {createBasicSubscription, createPremiumSubscription} from '../controllers/'

const router: Router = express.Router()

router.route('/plan/basic').post(createBasicSubscription)
router.route('/plan/premium').post(createPremiumSubscription)

export default router