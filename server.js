const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const DATABASE_URI = process.env.DATABASE_URI;

const app = express();

app.get("/", (req, res) => {
  res.send("Klosanow 🚀🚀🚀");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", require("./routers/api/auth"));
app.use("/api/v1/users", require("./routers/api/user"));

mongoose
  .connect(DATABASE_URI)
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error.message);
  });
