import mongoose from "mongoose";

import {Subscription} from '../utils/types'

const SubscriptionSchema = new mongoose.Schema<Subscription>({
    subscriptionType: {
        type: String,
        enum: ['free plan', 'basic plan', 'premium plan'],
        required: [true, 'please specify the type of subscription you want']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const subscription = mongoose.model('Subscription', SubscriptionSchema);

export default subscription;