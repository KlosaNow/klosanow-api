import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import debug from 'debug';
import * as expressWinston from 'express-winston';
import helmet from 'helmet';
import rateLimiter from 'express-rate-limit';
import xss from 'xss-clean';

import loggerOptions from './middleware/winstonConfig';

import router from './router';
import errorHandlerMiddleware from './middleware/errorHandler';

dotenv.config();

const PORT: string | number = process.env.PORT || 3001;
const DATABASE_URI: string = process.env.DATABASE_URI || 'undefined';

const app = express();

const debugLog: debug.IDebugger = debug('app');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!process.env.DEBUG) {
  loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));

app.get('/', (req, res) => {
  res.send('Auth service: Running');
});
app.use('/', router);

app.use(errorHandlerMiddleware);

const connectDB = async (url: string) => {
  await mongoose.connect(url);
};

const start = async () => {
  try {
    await connectDB(process.env.DATABASE_URI!);
    console.log(`Auth service: Connected to database`);
    app.listen(PORT, () => {
      debugLog(`Auth service: Running on port ${PORT}`);
      // console.log(`Auth service: Running on port ${PORT}`);
    });
  } catch (err) {
    debugLog(err);
  }
};

start();
