let system = require("../index");
const io = require('socket.io-client');
const config = require("../testConfig");

afterAll((done)=>{
  system.io.close();
  system.server.close();
  done();
})

describe('basic othello example', () => {
  test('blargh', (done) => {
    let sessionData = {};
    let socketFirst = null;
    let socketSecond = null;
    system.othello.initialiseStorage(sessionData);
    const runTest = ()=>
    {
      done();
    };
    const setupSocket2 = ()=>{
      config.createSocket(socketSecond, io, system.server, runTest);
    };
    config.createSocket(socketFirst, io, system.server, setupSocket2)
  });
});
