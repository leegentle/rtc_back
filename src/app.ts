const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

interface offerData {
  sendID: string;
  receiceID: string;
  offer: RTCPeerConnection;
}

// localhost 포트 설정
const port = 4002;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let users: { [roomName: string]: { socketId: string; nick: string }[] } = {};

// socketio 문법
io.on("connection", (socket: any) => {
  socket.on("join_room", (data: { roomName: string; nick: string }) => {
    const { roomName, nick } = data;
    const user = { socketId: socket.id, nick: nick };

    socket.join(roomName);

    if (users[roomName]) {
      users[roomName].push(user);
      const others = users[roomName].filter(
        (user) => user.socketId !== socket.id
      );
      io.to(socket.id).emit("otherUsers", others);
    } else {
      users[roomName] = [user];
    }
  });

  socket.on("offer", (data: offerData) => {
    const { sendID, offer, receiceID } = data;
    console.log("오퍼");
    io.to(receiceID).emit("offer", { offer, sendID });
  });

  socket.on("answer", (answer: any, roomName: string) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice: any, roomName: string) => {
    socket.to(roomName).emit("ice", ice);
  });

  socket.on("msg", (msgObj: any, roomName: string) => {
    console.log(msgObj);
    console.log(roomName);
    socket.to(roomName).emit("msg", msgObj);
  });

  socket.on("disconnect", function () {
    // console.log("user disconnected: ", socket.id);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
