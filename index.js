const http = require('http');
const path = require('path');
const express = require('express');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const options = {
  cors: {
    origins: "*",
  },
};
const io = socket(server, options);

// Socket
let state = {
  files: [
    {
      name: "01 Doubly Linked List.cpp",
      content:
        '#include <iostream>\n\nstruct Node\n{\n  int data;\n  Node *prev, *next;\n};\n\nNode *head = NULL;\n\nvoid create(int A[], Node *head);\nvoid display(Node *head);\n\nint main()\n{\n  int A[] = {2, 4, 6, 8, 10};\n  create(A, head);\n  std::cout << "HEAD" << std::endl;\n  display(head);\n  return 0;\n}\n\nvoid display(Node *p)\n{\n  while (p)\n  {\n    std::cout << "[" << p->prev << "|" << p->data << "|" << p << "|" << p->next << "]" << std::endl;\n    p = p->next;\n  }\n}\n\nvoid create(int A[], Node *p)\n{\n  Node *node = new Node;\n  node->data = A[0];\n  node->next = node->prev = NULL;\n\n  head = node;\n\n  Node *tail = head;\n\n  for (int i = 1; i < 5; i++)\n  {\n    Node *node = new Node;\n    node->data = A[i];\n    node->next = NULL;\n    node->prev = tail;\n\n    tail->next = node;\n\n    tail = node;\n  }\n}',
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

// SPA
app.use("/public", express.static(path.join(__dirname, "collaborative-code-editor-client", "public")));

app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "collaborative-code-editor-client", "index.html"));
});

server.listen(process.env.PORT || 3000);
