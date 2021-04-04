const app = require('express')();
const http = require('http').Server(app);
const production = !!process.env.PORT;
const io = require('socket.io')(http, {
  cors: {
    origin: production ? "https://andrew-murray.github.io" : "http://localhost",
    methods: ["GET", "POST"]
  }
});
const chatSession = require("./chatSession")
const othelloSession = require("./OthelloSession")

const port = process.env.PORT || 8080;


io.on('connection', function(socket) {
  chatSession.subscribe(io, socket);
  othelloSession.subscribe(io, socket);
});


let server = http.listen(port, () => {
  if (require.main === module) {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
  }
});

const path = `http://localhost:${port}/`;
