const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 3002;
const DATABASE_URI = process.env.DATABASE_URI;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./src/router"));

mongoose
  .connect(DATABASE_URI)
  .then(() => {
    console.log("User service: Connected to database");
    app.listen(PORT, () => {
      console.log(`User service: Running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error.message);
  });
