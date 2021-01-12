const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const chatSession = require("./chatSession")
const othelloSession = require("./OthelloSession")

const port = process.env.PORT || 8080;

chatSession.configureServer(io);

let server = http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

const path = `http://localhost:${port}/`;

module.exports = {
  server: server,
  path: path
}
