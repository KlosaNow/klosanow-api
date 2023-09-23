import mongoose from "mongoose";

import { TokenType } from "../utils/types";

const TokenSchema = new mongoose.Schema<TokenType>(
    {
        token: {
            type: String,
            required: true,
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
