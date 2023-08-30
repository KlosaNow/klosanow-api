import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import debug from "debug";
import * as expressWinston from "express-winston";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import "express-async-errors";
import cookieParser from "cookie-parser";

import loggerOptions from "./middleware/winstonConfig";

import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import lessonRouter from "./routes/lesson";
import uploadRouter from "./routes/upload";
import subscriptionRouter from "./routes/subscription";

import { DATABASE_URI, PORT, JWT_SECRET, DEBUG } from "./utils/config";

import {
    errorHandlerMiddleware,
    notFoundMiddleWare,
    authenticateUser,
    authenticateAdminUser,
} from "./middleware";

dotenv.config();

const app = express();

export const debugLog: debug.IDebugger = debug("app");

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.set("trust proxy", 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 60,
    })
);
app.use(helmet());
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser(JWT_SECRET));
app.use(express.urlencoded({ extended: true }));

if (!DEBUG) {
    loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));

app.get("/", (req, res) => {
    res.send("Auth service: Running");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", authenticateUser, authenticateAdminUser, userRouter);
app.use("/api/v1/lesson", authenticateUser, lessonRouter);
app.use("/api/v1/uploads", authenticateUser, uploadRouter);
app.use("/api/v1/subscription", authenticateUser, subscriptionRouter);

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleware);

const connectDB = async (url: string) => {
    await mongoose.connect(url);
};

const start = async () => {
    try {
        await connectDB(DATABASE_URI!);
        debugLog(`Auth service: Connected to database`);
        app.listen(PORT, () => {
            debugLog(`Auth service: Running on port ${PORT}`);
        });
    } catch (err) {
        const retrySeconds = 5;
        debugLog(err);
        setTimeout(start, retrySeconds * 1000);
    }
};

start();

export default app;
