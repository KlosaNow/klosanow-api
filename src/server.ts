import cors from "cors";
import express, { Request, Response } from "express";
import mongoose from "mongoose";

import { authRouter, userRouter, chatRouter } from "./routes";
import { DATABASE_URI, PORT } from "./utils/config";
import { internalServerError } from "./utils/CustomError";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("KlosaNow 🚀🚀🚀");
});

const connectDB = async (url: string) => {
    await mongoose.connect(url);
};

const start = async () => {
    try {
        await connectDB(DATABASE_URI!);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err: any) {
        throw internalServerError(err.message);
    }
};

start();

export default app;
