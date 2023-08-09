import {CustomRequest} from '../../utils'
import User from '../../models/User';
import subscription from '../../models/subscription';
import { Response } from 'express';
import { successRes } from '../../helpers'
import makePayment from '../../helpers/paystack'

const createPremuimSubscription = async(req: CustomRequest, res: Response) => {
    const {subType} = req.body
    let amount = 10000
    const user = req.user

    if (subType == 'premium plan'){
        const sub = new subscription({
            subscriptionType: subType,
            user: user._id
        })
        await sub.save()
        const pay = makePayment(amount, user.email, user.name).then((data) => {
            return res.status(200).json(successRes("Payment made successfully", data))})
    }

}

export default createPremuimSubscription