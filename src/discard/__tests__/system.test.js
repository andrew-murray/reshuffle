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
    const roomID = expect.getState().currentTestName;
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
  test('othello.move.pass',  () => {
    const roomID = expect.getState().currentTestName;
    return createRoomWithTwoPlayers(roomID).then((sockets)=>{
      // forget any events up until now
      sockets[0].eventHistory = [];
      sockets[1].eventHistory = [];

      // define current game state to be bugged case found through player
      const e = OthelloRules.labels.empty;
      const w = OthelloRules.labels.white;
      const b = OthelloRules.labels.black;
      sessionData[roomID].board = [
        [b,b,b,b,b,b,b,e],
        [b,b,w,w,w,b,b,b],
        [b,w,b,w,b,w,b,w],
        [b,b,w,b,w,w,b,w],
        [b,w,b,w,b,b,w,w],
        [b,b,w,b,w,w,b,w],
        [b,b,b,b,b,b,b,e],
        [e,b,b,b,b,b,b,b]
      ];
      sessionData[roomID].activePlayer = OthelloRules.labels.white;
      sessionData[roomID].status = "active";

      // white's turn
      sockets[1].emit("othello.move", {position: [0,7]});
      return Promise.resolve(config.awaitConditionOnSockets(
        sockets,
        (socket)=>{return socket.eventHistory.length === 1;}
      ));
    }).then(sockets=>{
      // this is somewhat a regression test
      // the case I've set up, actually seems to be behaving "okay"
      // which probably means I haven't accurately reproduced the bug

      // currently black can't play anywhere,
      // so automatically passes back to white
      // the behaviour I observed was that in some game state black could play
      // but when I sent moves - the server didn't process them properly

      // regress the current behaviour

      const e = OthelloRules.labels.empty;
      const w = OthelloRules.labels.white;
      const b = OthelloRules.labels.black;
      const boardState = [
        [b,b,b,b,b,b,b,w],
        [b,b,w,w,w,b,w,w],
        [b,w,b,w,b,w,b,w],
        [b,b,w,b,w,w,b,w],
        [b,w,b,w,b,b,w,w],
        [b,b,w,b,w,w,b,w],
        [b,b,b,b,b,b,b,e],
        [e,b,b,b,b,b,b,b]
      ];

      expect(sockets[0].eventHistory[0].event).toBe("othello.update");
      expect(sockets[0].eventHistory[0].arguments[0].role).toBe(OthelloRules.labels.black);
      expect(sockets[0].eventHistory[0].arguments[0].status).toBe("active");
      expect(sockets[0].eventHistory[0].arguments[0].activePlayer).toBe(OthelloRules.labels.white);

      expect(OthelloRules.boardsEqual(
        sockets[0].eventHistory[0].arguments[0].board,
        boardState
      )).toBeTruthy();

      expect(sockets[1].eventHistory[0].event).toBe("othello.update");
      expect(sockets[1].eventHistory[0].arguments[0].role).toBe(OthelloRules.labels.white);
      expect(sockets[1].eventHistory[0].arguments[0].status).toBe("active");
      expect(sockets[1].eventHistory[0].arguments[0].activePlayer).toBe(OthelloRules.labels.white);

      expect(OthelloRules.boardsEqual(
        sockets[1].eventHistory[0].arguments[0].board,
        boardState
      )).toBeTruthy();

      return sockets;
    }).then(sockets=>{
      return config.disconnectAll(system.io, sockets);
    });
  });
  test('othello.complete.typical',  () => {
    const roomID = expect.getState().currentTestName;
    return createRoomWithTwoPlayers(roomID).then((sockets)=>{
      // forget any events up until now
      sockets[0].eventHistory = [];
      sockets[1].eventHistory = [];

      // define current game state to be bugged case found through player
      const e = OthelloRules.labels.empty;
      const w = OthelloRules.labels.white;
      const b = OthelloRules.labels.black;
      // the below is an unreachable game state with two moves remaining
      sessionData[roomID].board = [
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,w,e,b,b,w,b,e],
      ];
      sessionData[roomID].activePlayer = OthelloRules.labels.white;
      sessionData[roomID].status = "active";

      // white's turn
      sockets[1].emit("othello.move", {position: [7,7]});
      return Promise.resolve(config.awaitConditionOnSockets(
        sockets,
        (socket)=>{return socket.eventHistory.length === 1;}
      ));
    }).then(sockets=>{
      const e = OthelloRules.labels.empty;
      const w = OthelloRules.labels.white;
      const b = OthelloRules.labels.black;
      const boardState = [
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,w,e,b,b,w,w,w]
      ];

      expect(sockets[0].eventHistory[0].event).toBe("othello.update");
      expect(sockets[0].eventHistory[0].arguments[0].role).toBe(OthelloRules.labels.black);
      expect(sockets[0].eventHistory[0].arguments[0].status).toBe("active");
      expect(sockets[0].eventHistory[0].arguments[0].activePlayer).toBe(OthelloRules.labels.black);

      expect(OthelloRules.boardsEqual(
        sockets[0].eventHistory[0].arguments[0].board,
        boardState
      )).toBeTruthy();

      expect(sockets[1].eventHistory[0].event).toBe("othello.update");
      expect(sockets[1].eventHistory[0].arguments[0].role).toBe(OthelloRules.labels.white);
      expect(sockets[1].eventHistory[0].arguments[0].status).toBe("active");
      expect(sockets[1].eventHistory[0].arguments[0].activePlayer).toBe(OthelloRules.labels.black);

      expect(OthelloRules.boardsEqual(
        sockets[1].eventHistory[0].arguments[0].board,
        boardState
      )).toBeTruthy();

      // black's turn
      sockets[0].eventHistory = [];
      sockets[1].eventHistory = [];
      sockets[0].emit("othello.move", {position: [7,2]});

      return Promise.resolve(config.awaitConditionOnSockets(
        sockets,
        (socket)=>{return socket.eventHistory.length === 1;}
      ));
    }).then(sockets=>{

      const e = OthelloRules.labels.empty;
      const w = OthelloRules.labels.white;
      const b = OthelloRules.labels.black;
      const boardState = [
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,b,b,b],
        [b,b,b,b,b,w,w,w]
      ];

      expect(sockets[0].eventHistory[0].event).toBe("othello.update");
      expect(sockets[0].eventHistory[0].arguments[0].role).toBe(OthelloRules.labels.black);
      expect(sockets[0].eventHistory[0].arguments[0].status).toBe("complete");
      expect(sockets[0].eventHistory[0].arguments[0].activePlayer).toBe(null);

      expect(OthelloRules.boardsEqual(
        sockets[0].eventHistory[0].arguments[0].board,
        boardState
      )).toBeTruthy();

      expect(sockets[1].eventHistory[0].event).toBe("othello.update");
      expect(sockets[1].eventHistory[0].arguments[0].role).toBe(OthelloRules.labels.white);
      expect(sockets[1].eventHistory[0].arguments[0].status).toBe("complete");
      expect(sockets[1].eventHistory[0].arguments[0].activePlayer).toBe(null);

      expect(OthelloRules.boardsEqual(
        sockets[1].eventHistory[0].arguments[0].board,
        boardState
      )).toBeTruthy();

      return sockets;
    }).then(sockets=>{
      return config.disconnectAll(system.io, sockets);
    });
  });
  test('othello.complete.unconventional',  () => {
    const roomID = expect.getState().currentTestName;
    return createRoomWithTwoPlayers(roomID).then((sockets)=>{
      // forget any events up until now
      sockets[0].eventHistory = [];
      sockets[1].eventHistory = [];

      // define current game state to be bugged case found through player
      const e = OthelloRules.labels.empty;
      const w = OthelloRules.labels.white;
      const b = OthelloRules.labels.black;
      // the below is an unreachable game state with one black move remaining
      sessionData[roomID].board = [
        [e,e,e,e,e,e,e,e],
        [e,e,b,e,e,e,e,e],
        [e,b,w,e,e,e,e,e],
        [e,e,b,e,e,w,e,e],
        [e,e,e,e,e,w,e,e],
        [e,e,e,e,e,w,e,e],
        [e,e,e,e,e,w,e,e],
        [e,e,e,e,e,e,e,e]
      ];
      sessionData[roomID].activePlayer = OthelloRules.labels.black;
      sessionData[roomID].status = "active";

      // black's turn
      sockets[0].emit("othello.move", {position: [2,3]});
      return Promise.resolve(config.awaitConditionOnSockets(
        sockets,
        (socket)=>{return socket.eventHistory.length === 1;}
      ));
    }).then(sockets=>{

      const e = OthelloRules.labels.empty;
      const w = OthelloRules.labels.white;
      const b = OthelloRules.labels.black;
      const boardState = [
        [e,e,e,e,e,e,e,e],
        [e,e,b,e,e,e,e,e],
        [e,b,b,b,e,e,e,e],
        [e,e,b,e,e,w,e,e],
        [e,e,e,e,e,w,e,e],
        [e,e,e,e,e,w,e,e],
        [e,e,e,e,e,w,e,e],
        [e,e,e,e,e,e,e,e]
      ];

      expect(sockets[0].eventHistory[0].event).toBe("othello.update");
      expect(sockets[0].eventHistory[0].arguments[0].role).toBe(OthelloRules.labels.black);
      expect(sockets[0].eventHistory[0].arguments[0].status).toBe("complete");
      expect(sockets[0].eventHistory[0].arguments[0].activePlayer).toBe(null);

      expect(OthelloRules.boardsEqual(
        sockets[0].eventHistory[0].arguments[0].board,
        boardState
      )).toBeTruthy();

      expect(sockets[1].eventHistory[0].event).toBe("othello.update");
      expect(sockets[1].eventHistory[0].arguments[0].role).toBe(OthelloRules.labels.white);
      expect(sockets[1].eventHistory[0].arguments[0].status).toBe("complete");
      expect(sockets[1].eventHistory[0].arguments[0].activePlayer).toBe(null);

      expect(OthelloRules.boardsEqual(
        sockets[1].eventHistory[0].arguments[0].board,
        boardState
      )).toBeTruthy();

      return sockets;
    }).then(sockets=>{
      return config.disconnectAll(system.io, sockets);
    });
  });
});
