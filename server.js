const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

let operations = [];

io.on("connection", (socket) => {
  console.log("New user connected");
  socket.emit("redraw", operations);
  socket.on("op", (op) => {
    operations.push(op);
    io.emit("op", op);
  });

  socket.on("undo", () => {
    if (operations.length > 0) operations.pop();
    io.emit("redraw", operations);
  });

  socket.on("clear", () => {
    operations = [];
    io.emit("redraw", operations);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
