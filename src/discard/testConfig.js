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

// todo: rewrite in an async idiom
const createSocket = (client, httpServer) => {
  return new Promise((resolve, reject) => {
    // Setup
    let httpServerAddr = httpServer.address();
    // Do not hardcode server port and address, square brackets are used for IPv6
    let socket = client.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
      transports: ['websocket'],
    });
    socket.eventHistory = [];
    // listen to any events
    socket.onAny((event, ...args)=>{
      socket.eventHistory.push({
          event: event,
          arguments: args
      });
    });
    socket.once('connect', ()=>{resolve(socket);});
  });
};

const createSockets  = (client, httpServer, n) => {
  return Promise.all(
    [...Array(n).keys()].map(i=>createSocket(client,httpServer))
  );
};

const disconnectAll = (io, sockets) =>
{
  return new Promise((resolve, reject) => {
    let remainingSocketIDs = sockets.map(s=>s.id);
    const disconnectCallback = (id)=>{
      const indexID = remainingSocketIDs.indexOf(id);
      if(indexID >= 0)
      {
        remainingSocketIDs.splice(indexID, 1);
      }
      if(remainingSocketIDs.length === 0){
        resolve(sockets);
      }
    };
    for( const socketID of remainingSocketIDs )
    {
      io.sockets.sockets.get(socketID).on(
        "disconnect",
        ()=>{disconnectCallback(socketID);}
      );
    }
    for(s of sockets)
    {
      s.disconnect(true);
    }
  });
};

const awaitConditionOnSocket = (socket,callback) => {
  return new Promise((resolve, reject) => {
    socket.onAny(()=>{
      if(callback(socket))
      {
        resolve(socket);
      }
    });
  });
};

const awaitConditionOnSockets = (sockets, callback) => {
  return Promise.all(
    sockets.map(socket=>awaitConditionOnSocket(socket, callback))
  );
};

const awaitConditionsOnSockets = (sockets, callbacks) => {
  return Promise.all(
    [...Array(sockets.length).keys()].map(i=>awaitConditionOnSocket(sockets[i], callbacks[i]))
  );
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

globals.createSocket = createSocket;
globals.createSockets = createSockets;
globals.disconnectAll = disconnectAll;
globals.awaitConditionOnSocket = awaitConditionOnSocket;
globals.awaitConditionOnSockets = awaitConditionOnSockets;
globals.awaitConditionsOnSockets = awaitConditionsOnSockets;

module.exports = globals;
