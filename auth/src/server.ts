import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import debug from 'debug';
import * as expressWinston from 'express-winston';
import helmet from 'helmet';
import rateLimiter from 'express-rate-limit';
import 'express-async-errors';
import cookieParser from 'cookie-parser';

import loggerOptions from './middleware/winstonConfig';

import authRouter from './routes/auth';
import userRouter from './routes/user';
import errorHandlerMiddleware from './middleware/errorHandler';
import notFoundMiddleWare from './middleware/notFound';
import { DATABASE_URI, PORT, JWT_SECRET, DEBUG } from './utils/config';

dotenv.config();

const app = express();

export const debugLog: debug.IDebugger = debug('app');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(cookieParser(JWT_SECRET));
app.use(express.urlencoded({ extended: true }));

if (!DEBUG) {
  loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));

app.get('/', (req, res) => {
  res.send('Auth service: Running');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

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
