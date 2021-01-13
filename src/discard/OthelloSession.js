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
      started: false
    };
  }
  else if(sessionData[roomID].players.size === 1)
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

  for( playerID of sessionData[roomID].players.keys() )
  {
    io.to(playerID).emit("othello.update",dataForPlayer(sessionData[roomID], playerID));
  }
};

const swapRoles = (io,socket,roomID)=>
{
  if(roomID in sessionData && sessionData[roomID].started === false)
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
  if(roomID in sessionData)
  {
    sessionData[roomID].board = OthelloRules.createInitialBoardState();
    sessionData[roomID].activePlayer = OthelloRules.labels.black;
    sessionData[roomID].started = false;
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
    started: data.started,
    role: data.players.get(playerID)
  };
}

const onMakeMove = (io, socket, roomID, position)=>
{
  if(roomID in sessionData
    && sessionData[roomID].players.has(socket.id)
    && sessionData[roomID].players.get(socket.id) === sessionData[roomID].activePlayer
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
        sessionData[roomID].activePlayer = opponent;
        sessionData[roomID].board = updatedBoard;
        sessionData[roomID].started = true;
      }
      else
      {
        // don't update the player,
        // because the player has to pass (or the game is over)
        sessionData[roomID].board = updatedBoard;
        sessionData[roomID].started = true;
      }
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
      if(sessionData[roomID].players.get(socket.id)!==null)
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
      }
    });
  });
};

module.exports = {
  initialiseStorage: initialiseStorage,
  configureServer: configureServer
};
