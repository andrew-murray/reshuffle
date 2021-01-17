/* istanbul ignore file */

const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');

// the setup code here is from a blogpost, to initialise servers properly
// while on the backend, not sure it's require what I want will have to see
// https://medium.com/@tozwierz/testing-socket-io-with-jest-on-backend-node-js-f71f7ec7010f

let globals = {}

/**
 * Setup WS & HTTP servers
 */
const beforeAll = (done) => {
  // note that in the original blogpost, this code was incorrect
  // and didn't execute properly
  globals.httpServer = http.createServer();
  globals.httpServerAddr = globals.httpServer.listen().address();
  globals.server = ioBack(globals.httpServer);
  done();
};

/**
 *  Cleanup WS & HTTP servers
 */
const afterAll = (done) => {
  globals.server.close();
  globals.httpServer.close();
  done();
};

/**
 * Run before each test
 */
const beforeEach = (done) => {
  // Setup
  // Do not hardcode server port and address, square brackets are used for IPv6
  globals.socket = io.connect(`http://[${globals.httpServerAddr.address}]:${globals.httpServerAddr.port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
  });
  globals.socket.on('connect', () => {
    done();
  });
};

/**
 * Run after each test
 */
const afterEach = (done) => {
  // Cleanup
  if (globals.socket.connected) {
    globals.socket.disconnect();
  }
  done();
};

globals.beforeEach = beforeEach;
globals.beforeAll = beforeAll;
globals.afterEach = afterEach;
globals.afterAll = afterAll;

module.exports = globals;
