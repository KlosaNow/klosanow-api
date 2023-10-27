import cors from "cors";
import express, { Request, Response } from "express";
import { authRouter, userRouter, chatRouter } from "./routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
// Since we are migrating to web sockets we don't need this route
//  app.use("/api/v1/chats", chatRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("KlosaNow 🚀🚀🚀");
});

export default app;
