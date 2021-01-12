const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const chatSession = require("./chatSession")

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

let sessions = {};

app.get('/', (req, res) => {
  res.render('index', {room: ""});
});

app.get('/room/:roomID/', function (req, res) {
  res.render('index', {room: req.params.roomID});
})

chatSession.configureServer(io);

let server = http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

const path = `http://localhost:${port}/`;

module.exports = {
  server: server,
  path: path
}
