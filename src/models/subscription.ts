import mongoose from "mongoose";

import {Subscription} from '../utils/types'

const SubscriptionSchema = new mongoose.Schema<Subscription>({
    subscriptionType: {
        type: String,
        enum: ['free', 'basic', 'premium'],
        required: [true, 'please specify the type of subscription you want'],
        default: 'free',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const subscription = mongoose.model('Subscription', SubscriptionSchema);

export default subscription;