const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// helps passing any request coming from frontend
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");

const app = express();

// Middlewares(handling JSON data and data that comes via URL and sending data to client with bodyParser)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes Middleware(all having prefix "api/users" then /register)
app.use("/api/users", userRoute);

// Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Connect ot DB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Speak Lord, Your server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
