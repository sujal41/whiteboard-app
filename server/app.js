require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const whiteboardRoutes = require("./routes/whiteboardRoutes");
const shapeRoutes = require("./routes/shapeRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/whiteboard", whiteboardRoutes);
app.use("/api/shapes", shapeRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome");
});


module.exports = app;