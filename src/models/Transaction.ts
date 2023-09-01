import mongoose from "mongoose";

import { TransactionType } from "../utils/types";

const TransactionSchema = new mongoose.Schema<TransactionType>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ref: {
            type: String,
            required: true,
        },
        method: {
            // card, transfer etc.
            type: String,
            // required: true
        },
        gateway: {
            // paystack, flutterwave, stripe etc.
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["successful", "unsuccessful", "pending", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
