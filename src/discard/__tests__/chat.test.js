let config = require("../testConfig");

beforeAll((done)=>{
  config.beforeAll(done);
})
afterAll((done)=>{
  config.afterAll(done);
})
beforeEach((done)=>{
  config.beforeEach(done);
})
afterEach((done)=>{
  config.afterEach(done);
})

describe('basic socket.io example', () => {
  test('should communicate', (done) => {
    // once connected, emit Hello World
    config.server.emit('echo', 'Hello World');
    config.socket.once('echo', (message) => {
      // Check that the message matches
      expect(message).toBe('Hello World');
      done();
    });
    config.server.on('connection', (mySocket) => {
      expect(mySocket).toBeDefined();
    });
  });
  test('should communicate with waiting for socket.io handshakes2X', (done) => {
    // Emit sth from Client do Server
    config.socket.emit('example', 'some messages');
    // Use timeout to wait for socket.io server handshakes
    setTimeout(() => {
      // Put your server side expect() here
      done();
    }, 50);
  });
});
