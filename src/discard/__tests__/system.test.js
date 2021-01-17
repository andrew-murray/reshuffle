let system = require("../index");
const io = require('socket.io-client');
const config = require("../testConfig");

afterAll((done)=>{
  system.io.close();
  system.server.close();
  done();
})

describe('basic othello example', () => {
  test('blargh',  (done) => {
    let sessionData = {};
    system.othello.initialiseStorage(sessionData);
    return config.createSockets(io, system.server, 2)
    .then((sockets)=>{done();});
  });
});
