require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ✅ Make io globally accessible
global.io = io;

// 🔥 SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // whiteboard rooo,
  socket.on("join-board", (boardId) => {
    socket.join(boardId);
  });

   // ✅ User personal room (for notifications)
  socket.on("join-user", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  // shape async
  socket.on("shape:create", ({ boardId, shape }) => {
    socket.to(boardId).emit("shape:created", shape);
  });

  socket.on("shape:update", ({ boardId, shape }) => {
    socket.to(boardId).emit("shape:updated", shape);
  });

  socket.on("shape:delete", ({ boardId, shapeId }) => {
    socket.to(boardId).emit("shape:deleted", shapeId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));