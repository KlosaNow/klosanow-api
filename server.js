const express = require("express");
const router = express.Router();

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Klosanow 🚀🚀🚀");
});

app.use("/api/users", require("./routers/api/user"));

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
