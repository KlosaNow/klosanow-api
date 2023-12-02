import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

import app from "./app";
import { socketControllers } from "./controllers";
import { authenticateSocket } from "./middleware"
import { internalServerError } from "./utils";
import { DATABASE_URI, PORT } from "./utils/config";

const connectDB = async (url: string) => {
  await mongoose.connect(url).then(() => console.log("Database connected"));
};

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
io.use(authenticateSocket)

const start = async () => {
  try {
    await connectDB(DATABASE_URI!);
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      io.on("connection", socketControllers);
    });
  } catch (err: any) {
    throw internalServerError(err.message);
  }
};

start();

export default server;
