const express = require("express");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Klosanow 🚀🚀🚀");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v2", require("./src/router"));

app.listen(PORT, () => {
  console.log(`Gateway service: Running on port ${PORT}`);
});

module.exports = app;
