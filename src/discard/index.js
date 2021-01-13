const app = require('express')();
const http = require('http').Server(app);
// todo: only enable cors in dev?
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"]
  }
});
const chatSession = require("./chatSession")
const othelloSession = require("./OthelloSession")

const port = process.env.PORT || 8080;

chatSession.configureServer(io);
othelloSession.configureServer(io);

let server = http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

const path = `http://localhost:${port}/`;

module.exports = {
  server: server,
  path: path
}
