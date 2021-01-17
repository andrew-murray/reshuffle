let system = require("../index");
const io = require('socket.io-client');
const config = require("../testConfig");

afterAll((done)=>{
  system.io.close();
  system.server.close();
  done();
})

describe('basic othello example', () => {
  test('othello.join',  () => {
    const roomID = "my-silly-room";
    let sessionData = {};
    system.othello.initialiseStorage(sessionData);
    return config.createSockets(io, system.server, 2).then((sockets)=>{
      // assert current state
      expect(sessionData).toMatchObject({});
      expect(sockets[0].eventHistory).toStrictEqual([]);
      expect(sockets[1].eventHistory).toStrictEqual([]);

      sockets[0].emit("othello.join", roomID);
      sockets[1].emit("othello.join", roomID);

      const successCriteria = [...Array(sockets.length).keys()].map(
        // expect 2 state updates for player 0 and 1 for player 2
        i => ()=>{
            return sockets[i].eventHistory.length >= sockets.length - i - 1;
        }
      );

      return config.awaitConditionsOnSockets(
        sockets,
        successCriteria
      );
    })
    .then((sockets)=>{
      expect(sockets[0].eventHistory.length).toBe(2);
      expect(sockets[1].eventHistory.length).toBe(1);
      return config.disconnectAll(system.io, sockets);
    });
  });
});
