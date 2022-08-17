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
  socket.on("join_room", (roomName: string) => {
    console.log("방이름 : " + roomName);
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });

  socket.on("offer", (offer: any, roomName: string) => {
    console.log("오퍼");
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer: any, roomName: string) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice: any, roomName: string) => {
    socket.to(roomName).emit("ice", ice);
  });

  socket.on("msg", (msgObj: any, roomName: string) => {
    socket.to(roomName).emit("msg", msgObj);
  });

  socket.on("disconnect", function () {
    // console.log("user disconnected: ", socket.id);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
