const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

// localhost 포트 설정
const port = 4002;

const app = express();

// server instance
const server = http.createServer(app);

// socketio 생성후 서버 인스턴스 사용
const io = socketIO(server);

// socketio 문법
io.on("connection", (socket: any) => {
  console.log("User connected");
  socket.on("disconnect", () => {
    console.log("User disconnect");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
