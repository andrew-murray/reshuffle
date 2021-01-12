const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');

// the setup code here is from a blogpost, to initialise servers properly
// while on the backend, not sure it's require what I want will have to see
// https://medium.com/@tozwierz/testing-socket-io-with-jest-on-backend-node-js-f71f7ec7010f

let socket;
let httpServer;
let httpServerAddr;
let ioServer;

/**
 * Setup WS & HTTP servers
 */
beforeAll((done) => {
  // note that in the original blogpost, this code was incorrect
  // and didn't execute properly
  httpServer = http.createServer();
  httpServerAddr = httpServer.listen().address();
  ioServer = ioBack(httpServer);
  done();
});

/**
 *  Cleanup WS & HTTP servers
 */
afterAll((done) => {
  ioServer.close();
  httpServer.close();
  done();
});

/**
 * Run before each test
 */
beforeEach((done) => {
  // Setup
  // Do not hardcode server port and address, square brackets are used for IPv6
  socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
  });
  socket.on('connect', () => {
    done();
  });
});

/**
 * Run after each test
 */
afterEach((done) => {
  // Cleanup
  if (socket.connected) {
    socket.disconnect();
  }
  done();
});


describe('basic socket.io example', () => {
  test('should communicate', (done) => {
    // once connected, emit Hello World
    ioServer.emit('echo', 'Hello World');
    socket.once('echo', (message) => {
      // Check that the message matches
      expect(message).toBe('Hello World');
      done();
    });
    ioServer.on('connection', (mySocket) => {
      expect(mySocket).toBeDefined();
    });
  });
  test('should communicate with waiting for socket.io handshakes', (done) => {
    // Emit sth from Client do Server
    socket.emit('example', 'some messages');
    // Use timeout to wait for socket.io server handshakes
    setTimeout(() => {
      // Put your server side expect() here
      done();
    }, 50);
  });
});
