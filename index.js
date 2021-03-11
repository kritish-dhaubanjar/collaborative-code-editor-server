const app = require("express")();
const server = require("http").createServer(app);
const options = {
  cors: {
    origins: "*",
  },
};

const io = require("socket.io")(server, options);

let state = {
  files: [
    {
      name: "main.cpp",
      content:
        "#include<iostream>\nusing namespace std;\n\nint main(){\n  return 0;\n}",
    },
  ],
  active: 0,
  mode: "text/x-c++src",
};

io.on("connection", (socket) => {
  console.log(socket.id);
  io.emit("broadcast", state);

  socket.on("emit", (arg) => {
    state = arg;
    socket.broadcast.emit("broadcast", state);
  });
});

server.listen(process.env.PORT || 3000);
