const express = require("express");
const { default: mongoose } = require("mongoose");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const DATABASE_URI = process.env.DATABASE_URI;

const app = express();

app.get("/", (req, res) => {
  res.send("Klosanow 🚀🚀🚀");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", require("./routers/api/user"));

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
