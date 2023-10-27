import mongoose from "mongoose";
import { DATABASE_URI, PORT } from "./utils/config";
import app from "./app";
import { internalServerError } from "./utils/CustomError";
import { createServer } from "http";

const connectDB = async (url: string) => {
    await mongoose.connect(url).then(() => console.log("Database connected"));
};

const server = createServer(app);

const start = async () => {
    try {
        await connectDB(DATABASE_URI!);
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err: any) {
        throw internalServerError(err.message);
    }
};

start();

export default server;
