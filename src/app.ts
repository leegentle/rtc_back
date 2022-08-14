import express, { Request, Response, NextFunction } from "express";

const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: ["*"],
  },
});
const PORT = 3001;

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("welcome!");
});

io.on("connection", function (socket: any) {
  console.log(socket.id, "Connected");

  socket.emit("msg", `${socket.id} 연결 되었습니다.`);

  socket.on("msg", function (data: any) {
    console.log(socket.id, data);

    socket.emit("msg", `Server : "${data}" 받았습니다.`);
  });
});

io.on("connect_error", (err: any) => {
  console.log(`connect_error due to ${err.message}`);
});

app.listen(PORT, () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: ${PORT}🛡️
  ################################################
`);
});
