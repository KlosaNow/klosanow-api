import cors from "cors";
import express, { Request, Response } from "express";

import {
	authRouter,
	lessonRouter,
	mediaRouter,
	userRouter,
	draftRouter,
} from "./routes";

const API_PATH = "/api/v1";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use(`${API_PATH}/auth`, authRouter);
app.use(`${API_PATH}/lessons`, lessonRouter);
app.use(`${API_PATH}/media`, mediaRouter);
app.use(`${API_PATH}/users`, userRouter);
app.use(`${API_PATH}/drafts`, draftRouter);

app.get("/", (req: Request, res: Response) => {
	res.send("KlosaNow 🚀🚀🚀");
});

export default app;
