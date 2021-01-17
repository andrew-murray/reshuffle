let system = require("../index");
const io = require('socket.io-client');
const config = require("../testConfig");
const OthelloRules = require("../OthelloRules");

let sessionData = {};
system.othello.initialiseStorage(sessionData);

afterAll((done)=>{
  system.io.close();
  system.server.close();
  done();
})

const createRoomWithTwoPlayers = (roomID)=>{
  return config.createSockets(io, system.server, 2)
    .then((sockets)=>{
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
    });
}

describe('basic othello example', () => {
  test('othello.join',  () => {
    const roomID = "my-silly-room";
    return createRoomWithTwoPlayers(roomID)
      .then((sockets)=>{
        expect(sockets[0].eventHistory.length).toBe(2);

        // first event, sockets[0] joined
        expect(sockets[0].eventHistory[0].event).toBe("othello.update");
        expect(sockets[0].eventHistory[0].arguments[0].role).toBe(OthelloRules.labels.black);
        expect(sockets[0].eventHistory[0].arguments[0].status).toBe("new");
        expect(sockets[0].eventHistory[0].arguments[0].activePlayer).toBe(null);
        expect(OthelloRules.boardsEqual(
          sockets[0].eventHistory[0].arguments[0].board,
          OthelloRules.createInitialBoardState()
        )).toBeTruthy();

        // second event, sockets[1] joined,  sent to sockets[0]
        expect(sockets[0].eventHistory[1].event).toBe("othello.update");
        expect(sockets[0].eventHistory[1].arguments[0].role).toBe(OthelloRules.labels.black);
        expect(sockets[0].eventHistory[1].arguments[0].status).toBe("new");
        expect(sockets[0].eventHistory[1].arguments[0].activePlayer).toBe(OthelloRules.labels.black);
        expect(OthelloRules.boardsEqual(
          sockets[0].eventHistory[1].arguments[0].board,
          OthelloRules.createInitialBoardState()
        )).toBeTruthy();

        // second event, sockets[1] joined, sent to sockets[1]
        expect(sockets[1].eventHistory.length).toBe(1);
        expect(sockets[1].eventHistory[0].event).toBe("othello.update");
        expect(sockets[1].eventHistory[0].arguments[0].role).toBe(OthelloRules.labels.white);
        expect(sockets[1].eventHistory[0].arguments[0].status).toBe("new");
        expect(sockets[1].eventHistory[0].arguments[0].activePlayer).toBe(OthelloRules.labels.black);
        expect(OthelloRules.boardsEqual(
          sockets[0].eventHistory[1].arguments[0].board,
          OthelloRules.createInitialBoardState()
        )).toBeTruthy();

        return config.disconnectAll(system.io, sockets);
      });
  });
});
