const app = require("express")();
const server = require("http").createServer(app);
const options = {
  cors: {
    origins: "*",
  },
};

const io = require("socket.io")(server, options);

io.on("connection", (socket) => {
  socket.on("emit", (arg) => {
    console.log(arg);
    socket.broadcast.emit("broadcast", arg);
  });
});

server.listen(process.env.PORT || 3000);
