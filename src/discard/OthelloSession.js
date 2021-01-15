const OthelloRules = require("../games/OthelloRules");

let sessionData = {};

const initialiseStorage = (storage) =>
{
  sessionData = storage;
}

const onConnect = (io, socket, roomID) =>
{
  console.log("connect fired for socket " + socket.id + " for room " + roomID);
  console.log(sessionData);
  if(roomID in sessionData && sessionData[roomID].players.has(socket.id))
  {
    // do nothing, player is already in the room
  }
  else if(!(roomID in sessionData))
  {
    sessionData[roomID] = {
      board: OthelloRules.createInitialBoardState(),
      activePlayer: null,
      players: new Map( [[socket.id, OthelloRules.labels.black]] ),
      status: "new"
    };
  }
  else if(sessionData[roomID].players.size === 1 && sessionData[roomID])
  {
    console.log("creating player based on opponent");
    const existingRole = Array.from(sessionData[roomID].players.values())[0];
    sessionData[roomID].players.set(socket.id,OthelloRules.opponentForPlayer(existingRole));
    // second player has joined, we can start
    sessionData[roomID].activePlayer = OthelloRules.labels.black;
  }
  else
  {
    console.log("creating observer")
    // observer
    sessionData[roomID].players.set(socket.id, null);
  }
  console.log(sessionData[roomID]);
  // regardless of the above - send the player the appropriate update
  let observerCount = 0;
  for( let playerKind of sessionData[roomID].players.values() )
  {
      observerCount += playerKind === null;
  }
  const playerCount = sessionData[roomID].players.size - observerCount;
  const playerString = playerCount.toString() + " player" + (playerCount !== 1 ? "s" : "");
  const obString = observerCount.toString() + " observer" + (observerCount !== 1 ? "s" : "");
  const playerMessage = "There " + (playerCount !== 1 ? "are " : "is ")
    + playerString + " and " + obString + " present.";
  for( playerID of sessionData[roomID].players.keys() )
  {
    io.to(playerID).emit("othello.update",dataForPlayer(sessionData[roomID], playerID));
  }
  io.to(roomID).emit("chat.message", playerMessage);
};

const swapRoles = (io,socket,roomID)=>
{
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
  for( playerID of sessionData[roomID].players.keys() )
  {
    io.to(playerID).emit("othello.update",dataForPlayer(sessionData[roomID], playerID));
  }
}

const restartGame = (io, socket, roomID) =>
{
  if(roomID in sessionData && sessionData[roomID].status !== "active")
  {
    sessionData[roomID].board = OthelloRules.createInitialBoardState();
    sessionData[roomID].activePlayer = OthelloRules.labels.black;
    // status is an object, when conceded (see below)
    sessionData[roomID].status = "new";
  }
  for( playerID of sessionData[roomID].players.keys() )
  {
    io.to(playerID).emit("othello.update",dataForPlayer(sessionData[roomID], playerID));
  }
};

const concedeGame = (io, socket, roomID) =>
{
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
  for( playerID of sessionData[roomID].players.keys() )
  {
    io.to(playerID).emit("othello.update",dataForPlayer(sessionData[roomID], playerID));
  }
};

const dataForPlayer = (data, playerID)=>
{
  return {
    board: data.board,
    activePlayer: data.activePlayer,
    status: data.status,
    role: data.players.get(playerID)
  };
}

const onMakeMove = (io, socket, roomID, position)=>
{
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
      }
      sessionData[roomID].board = updatedBoard;

      const gameOver = 64 === OthelloRules.countCellsForRole(
        updatedBoard,
        OthelloRules.labels.empty
      );

      sessionData[roomID].status = gameOver ? "complete" : "active";
    }

    for( playerID of sessionData[roomID].players.keys() )
    {
      io.to(playerID).emit("othello.update",dataForPlayer(sessionData[roomID], playerID) );
    }
  }
}

const onDisconnect = (io, socket, roomID)=>
{
  if(!io.sockets.adapter.rooms.get(roomID))
  {
    console.log("closing room " + roomID + " due to "+ socket.id + " disconnecting ")
    delete sessionData[roomID];
  }
  else
  {
    console.log("disconnecting socket " + socket.id + " from room " + roomID)
    sessionData[roomID].players.delete(socket.id);
  }
};

const configureServer = (io)=>{
  io.on('connection', function(socket) {
    socket.on('othello.join', function(roomID){
      console.log("received othello.join for " + roomID);
      // todo: just want to get to the point where we can receive
      // the initial population of the board first
      onConnect(io, socket, roomID);
      socket.on("disconnect",()=>{
        onDisconnect(io, socket, roomID);
      });
      // wire up game actions, if necessary
      if(sessionData[roomID].players.get(socket.id) !== null)
      {
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
      }
    });
  });
};

module.exports = {
  initialiseStorage: initialiseStorage,
  configureServer: configureServer
};
