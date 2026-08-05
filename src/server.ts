import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

import app from "./app";
import { ChatSocketHandlers, StudyChatSocketHandlers } from "./sockets";
import { authenticateSocket } from "./middleware";
import { internalServerError } from "./utils";
import { DATABASE_URI, PORT } from "./utils/config";

const connectDB = async (url: string) => {
	await mongoose.connect(url).then(() => console.log("Database connected"));
};

const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: [
			"https://klosanow-frontend.vercel.app",
			"http://localhost:5173",
			"https://klosanow-frontend-git-feature-study-chat-klosanow-frontend.vercel.app",
			"https://devapp.klosanow.com",
			"https://app.klosanow.com",
		],
		credentials: true,
	},
});
// const io = new Server(server);
io.use(authenticateSocket);

const start = async () => {
	try {
		await connectDB(DATABASE_URI!);
		server.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
			io.on("connection", (socket) => ChatSocketHandlers(io, socket));
			io.on("connection", (socket) => StudyChatSocketHandlers(io, socket));
		});
	} catch (err: any) {
		throw internalServerError(err.message);
	}
};

start();

export default server;
