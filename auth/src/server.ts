import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import router from "./router";

dotenv.config();

const PORT: string | number = process.env.PORT || 3001;
const DATABASE_URI: string | string = process.env.DATABASE_URI || "undefined";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

mongoose
  .connect(DATABASE_URI)
  .then(() => {
    console.log("Auth service: Connected to database");
    app.listen(PORT, () => {
      console.log(`Auth service: Running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error(error.message);
  });
