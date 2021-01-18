const OthelloRules = require("./OthelloRules");
const debug = require("debug");
const debugEvent = debug("othello");
const debugState = debug("othello.state");

let sessionData = {};

const initialiseStorage = (storage) =>
{
  sessionData = storage;
}

const dataForPlayer = (data, playerID) =>
{
  return {
    board: data.board,
    activePlayer: data.activePlayer,
    status: data.status,
    role: data.players.get(playerID)
  };
}

const refreshClientState = (io, roomID) =>
{
  for( playerID of sessionData[roomID].players.keys() )
  {
    io.to(playerID).emit("othello.update",dataForPlayer(sessionData[roomID], playerID) );
  }
};

const sendPlayerUpdate = (io, roomID) =>
{
  const observerCount = countObservers(sessionData[roomID].players);
  const playerCount = sessionData[roomID].players.size - observerCount;
  const playerString = playerCount.toString() + " player" + (playerCount !== 1 ? "s" : "");
  const obString = observerCount.toString() + " observer" + (observerCount !== 1 ? "s" : "");
  const playerMessage = "There " + (playerCount !== 1 ? "are " : "is ")
    + playerString + " and " + obString + " present.";
  io.to(roomID).emit("chat.message", playerMessage);
};

const onConnect = (io, socket, roomID) =>
{
  debugEvent("received connect for socket " + socket.id + " for room " + roomID);
  if(roomID in sessionData && sessionData[roomID].players.has(socket.id))
  {
    // do nothing, player is already in the room
  }
  else if(!(roomID in sessionData))
  {
    debugEvent("created room");
    sessionData[roomID] = {
      board: OthelloRules.createInitialBoardState(),
      activePlayer: null,
      players: new Map( [[socket.id, OthelloRules.labels.black]] ),
      status: "new"
    };
  }
  else if(sessionData[roomID]
    && (sessionData[roomID].players.size - countObservers(sessionData[roomID].players)) === 1)
  {
    debugEvent("adding opponent");
    const existingRole = Array.from(sessionData[roomID].players.values())[0];
    sessionData[roomID].players.set(socket.id,OthelloRules.opponentForPlayer(existingRole));
    // second player has joined, we can start
    sessionData[roomID].activePlayer = OthelloRules.labels.black;
  }
  else
  {
    debugEvent("adding observer")
    // observer
    sessionData[roomID].players.set(socket.id, null);
  }
  debugState(sessionData[roomID]);
  // regardless of the above - send the player the appropriate update
  refreshClientState(io, roomID);
  sendPlayerUpdate(io, roomID);
};

const swapRoles = (io,socket,roomID)=>
{
  debugEvent("received swap for socket " + socket.id + " for room " + roomID);
  debugState(sessionData[roomID]);

  if(roomID in sessionData && sessionData[roomID].status !== "active")
  {
    const playerArray = Array.from(sessionData[roomID].players);
    const updatedPlayerArray = playerArray.map(idAndRole =>[
      idAndRole[0],
      idAndRole[1] !== null ?  OthelloRules.opponentForPlayer(idAndRole[1]) : null
    ]);
    const updatedPlayers = new Map( updatedPlayerArray );
    sessionData[roomID].players = updatedPlayers;
  }
  refreshClientState(io, roomID);
}

const countObservers = (players) =>
{
  let observerCount = 0;
  for( let playerKind of players.values() )
  {
      observerCount += playerKind === null;
  }
  return observerCount;
};

const restartGame = (io, socket, roomID) =>
{
  debugEvent("received restart for socket " + socket.id + " for room " + roomID);
  debugState(sessionData[roomID]);
  if(roomID in sessionData && sessionData[roomID].status !== "active")
  {
    sessionData[roomID].board = OthelloRules.createInitialBoardState();
    const playerCount = sessionData[roomID].players.size - countObservers(sessionData[roomID].players);
    sessionData[roomID].activePlayer = playerCount == 2 ? OthelloRules.labels.black : null;
    // status is an object, when conceded (see below)
    sessionData[roomID].status = "new";
  }
  refreshClientState(io, roomID);
};

const concedeGame = (io, socket, roomID) =>
{
  debugEvent("received concede for socket " + socket.id + " for room " + roomID);
  debugState(sessionData[roomID]);
  let msg = null;
  if(roomID in sessionData
    && sessionData[roomID].players.has(socket.id))
  {
    const playerRole = sessionData[roomID].players.get(socket.id);
    if( playerRole !== null )
    {
      sessionData[roomID].activePlayer = null;
      sessionData[roomID].status = {
        winner : OthelloRules.opponentForPlayer(playerRole),
        conceded: true
      };
      msg = ( playerRole === OthelloRules.labels.white ? "White" : "Black" ) + " conceded the game.";
    }
  }
  if(msg)
  {
    io.to(roomID).emit("chat.message", msg);
  }
  refreshClientState(io, roomID);
};

const onMakeMove = (io, socket, roomID, position)=>
{
  debugEvent("received move for socket " + socket.id + " for room " + roomID);
  debugState(sessionData[roomID]);
  if(roomID in sessionData
    && sessionData[roomID].players.has(socket.id)
    && sessionData[roomID].players.get(socket.id) === sessionData[roomID].activePlayer
    && (sessionData[roomID].status === "new" || sessionData[roomID].status === "active")
  )
  {
    // we can make a move, now we need to validate it
    const validMove = OthelloRules.canPlay(
      sessionData[roomID].board,
      sessionData[roomID].activePlayer,
      position
    );
    if(validMove)
    {
      const updatedBoard = OthelloRules.createBoardStateWithMove(
        sessionData[roomID].board,
        position,
        sessionData[roomID].activePlayer
      );
      const opponent = OthelloRules.opponentForPlayer(sessionData[roomID].activePlayer);
      if(OthelloRules.playerCanPlay(updatedBoard, opponent))
      {
        // don't update the player, when they have no available moves
        // (they have to pass)
        sessionData[roomID].activePlayer = opponent;
        sessionData[roomID].status = "active";
      }
      else
      {
        // don't update player, but check whether we should end the game
        const gameOver = !OthelloRules.playerCanPlay(
          updatedBoard,
          sessionData[roomID].activePlayer
        );
        sessionData[roomID].status = gameOver ? "complete" : "active";
        sessionData[roomID].activePlayer = gameOver ? null : sessionData[roomID].activePlayer;
      }
      sessionData[roomID].board = updatedBoard;
    }

    refreshClientState(io, roomID);
  }
}

const onDisconnect = (io, socket, roomID) =>
{
  debugEvent("received disconnect for socket " + socket.id + " for room " + roomID);
  debugState(sessionData[roomID]);
  if(!io.sockets.adapter.rooms.get(roomID))
  {
    debugEvent("closing room")
    delete sessionData[roomID];
  }
  else
  {
    debugEvent("removing player")
    sessionData[roomID].players.delete(socket.id);
    sendPlayerUpdate(io, roomID);
  }
};

const subscribe = (io, socket)=>{
  socket.on('othello.join', function(roomID){
    debugEvent("received othello.join for " + roomID);
    // todo: just want to get to the point where we can receive
    // the initial population of the board first
    // wire up game actions, if necessary
    const needsWiring = !(roomID in sessionData) || !sessionData[roomID].players.has(socket.id);
    if(needsWiring)
    {
      onConnect(io, socket, roomID);
      socket.on("othello.move",(move)=>{
        onMakeMove(io, socket, roomID, move.position);
      });
      socket.on('othello.swap', ()=>{
        swapRoles(io, socket, roomID);
      });
      socket.on('othello.reset', ()=>{
        restartGame(io, socket, roomID);
      });
      socket.on('othello.concede', ()=>{
        concedeGame(io, socket, roomID);
      });
      socket.on("disconnect",()=>{
        onDisconnect(io, socket, roomID);
      });
    }
  });
};

module.exports = {
  initialiseStorage: initialiseStorage,
  subscribe: subscribe,
  refreshClientState: refreshClientState
};
