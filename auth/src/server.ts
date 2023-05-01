import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import debug from 'debug'
import * as winston from 'winston';
import * as expressWinston from 'express-winston';

import loggerOptions from './middleware/winstonConfig';

import router from "./router";

dotenv.config();

const PORT: string | number = process.env.PORT || 3001;
const DATABASE_URI: string = process.env.DATABASE_URI || "undefined";

const app = express();

const debugLog: debug.IDebugger = debug('app');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!process.env.DEBUG) {
  loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));



app.get('/', (req, res) => { res.send('Auth service: Running') });
app.use("/", router);

app.listen(PORT, () => {
  debugLog(`Auth service: Running on port ${PORT}`)
  console.log(`Auth service: Running on port ${PORT}`);
});

// mongoose
//   .connect(DATABASE_URI)
//   .then(() => {
//     console.log("Auth service: Connected to database");
//     app.listen(PORT, () => {
//       console.log(`Auth service: Running on port ${PORT}`);
//     });
//   })
//   .catch((error: Error) => {
//     console.error(error.message);
//   });
