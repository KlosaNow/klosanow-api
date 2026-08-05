import cors from "cors";
import express, { Request, Response } from "express";

import {
	authRouter,
	lessonRouter,
	mediaRouter,
	userRouter,
	draftRouter,
	chatRouter,
	studychatRouter,
	pushNotificationRouter,
} from "./routes";

const API_PATH = "/api/v1";
// const corsOptions = {
//   origin: ["https://klosanow-frontend.vercel.app", "http://localhost:5173"],
// };

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Routes
app.use(`${API_PATH}/auth`, authRouter);
app.use(`${API_PATH}/lessons`, lessonRouter);
app.use(`${API_PATH}/media`, mediaRouter);
app.use(`${API_PATH}/users`, userRouter);
app.use(`${API_PATH}/drafts`, draftRouter);
app.use(`${API_PATH}/chats`, chatRouter);
app.use(`${API_PATH}/studychats`, studychatRouter);
app.use(`${API_PATH}/push`, pushNotificationRouter);

app.get("/", (req: Request, res: Response) => {
	res.send("KlosaNow 🚀🚀🚀");
});

export default app;
