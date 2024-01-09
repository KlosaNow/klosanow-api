import cors from "cors";
import express, { Request, Response } from "express";

import { authRouter, lessonRouter, mediaRouter, userRouter } from "./routes";

const API_PATH = "/api/v1";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(`${API_PATH}/auth`, authRouter);
app.use(`${API_PATH}/lessons`, lessonRouter);
app.use(`${API_PATH}/media`, mediaRouter);
app.use(`${API_PATH}/users`, userRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("KlosaNow 🚀🚀🚀");
});

export default app;
