const OthelloRules = require("./OthelloRules");

let sessionData = {};

function initialiseStorage(storage)
{
  sessionData = storage;
}

const onConnect = (io, socket, roomID)
{
  if(roomID in sessionData)
  {
    sessionData[roomID] = {
      board: OthelloRules.createInitialBoardState(),
      playerActive: Othello.labels.black,
      players: {socket.id: Othello.labels.black},
      started: false
    };
  }
  else if(Object.keys(sessionData[roomID].players).length == 1)
  {
    const existingRole = Object.values(sessionData[roomID].players)[0];
    sessionData[roomID].players[socket.id] = OthelloRules.opponentForPlayer(existingRole);
  }
  else
  {
    // disconnect appropriately
  }
  // FIXME: send out events (success/failure)
};

const swapRoles = (io,sockets,roomID)
{
  if(roomID in sessionData && sessionData[roomID].started === false)
  {
    const updatedPlayers = new Map (
      Array.from(sessionData[roomID].players).map((id, role)=>(id, OthelloRules.opponentForPlayer(role)))
    );
    sessionData[roomID].players = updatedPlayers;
  }
  // FIXME: send out events (success/failure)
}

const restartGame = (io, socket, roomID, position)
{
  if(roomID in sessionData)
  {
    sessionData[roomID].board = OthelloRules.createInitialBoardState();
    sessionData[roomID].playerActive = Othello.labels.black;
    sessionData[roomID].started = false;
  }
  // FIXME: send out events (success/failure)
};

const onMakeMove = (io, socket, roomID, position)
{
  if(roomID in sessionData
    && socket.id in sessionData[roomID].players
    && sessionData[roomID].players[socket.id] === sessionData[roomID].playerActive
  )
  {
    // we can make a move, now we need to validate it
    const validMove = OthelloRules.canPlay(
      sessionData[roomID].board,
      sessionData[roomID].playerActive,
      position
    );
    if(validMove)
    {
      const updatedBoard = createBoardStateWithMove(
        sessionData[roomID].board,
        position,
        sessionData[roomID].playerActive
      );
      const opponent = OthelloRules.opponentForPlayer(sessionData[roomID].playerActive);
      if(OthelloRules.playerCanPlay(updatedBoard, opponent))
      {
        sessionData[roomID].playerActive = opponent;
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
    // FIXME: send out events (success/failure)
  }
}

const onDisconnect = (io, socket, roomID)
{
  if(!io.sockets.adapter.rooms.get(roomID))
  {
    delete sessionData[roomID];
  }
};
