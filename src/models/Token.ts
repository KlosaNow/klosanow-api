import mongoose from "mongoose";

import { TokenType } from "../utils/types";

const TokenSchema = new mongoose.Schema<TokenType>(
    {
        refreshToken: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        otpVerified: {
            type: Boolean,
            default: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Token = mongoose.model("Token", TokenSchema);

export default Token;
