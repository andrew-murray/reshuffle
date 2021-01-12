const CircularBuffer = require("circular-buffer");
const rooms = require("./rooms");

let sessionData = {};

function initialiseStorage(storage)
{
  sessionData = storage;
}

function getChatHistory(roomID)
{
  if( roomID in sessionData )
  {
    return sessionData[roomID].history.toarray();
  }
  return null;
}

function emitChatMessage(io, roomID, msg)
{
  io.to(roomID).emit('chat.message', msg);
  sessionData[roomID].history.push(msg);
}

function createChatIfNecessary(roomID)
{
  if(!(roomID in sessionData))
  {
    sessionData[roomID] = {history: new CircularBuffer(100)};
    sessionData[roomID].history.push("this room was created...")
  }
}

function deleteChatIfNecessary(io, roomID)
{
  if(!io.sockets.adapter.rooms.get(roomID))
  {
    // room has already been cleared - clear associated data
    delete sessionData[roomID];
  }
}

function joinChatRoom(io, socket, roomID)
{
  createChatIfNecessary(roomID);

  const existingMessages = getChatHistory(roomID);

  socket.on('disconnect', reason => {
    deleteChatIfNecessary(io, roomID);
    socket.to(roomID).emit('chat message', "someone left...");
  });

  socket.on('chat.message', msg => {emitChatMessage(io, roomID, msg);});

  for(msg of existingMessages)
  {
    socket.emit('chat.message', msg);
  }
  socket.to(roomID).emit('chat.message', "someone joined!")
}

// we adopt this slightly awkward syntax
// so that we can test the functionality in environments outside
// the live server
function configureServer(io) // expects a socket.io server
{
  io.on('connection', function(socket) {

    socket.on('chat.create', (optionalID) => {
      if(optionalID)
      {
        if(io.sockets.adapter.rooms.get(optionalID))
        {
          const msg = "Attempted to create a room that already exists";
          console.log(msg);
          // todo: this may/may not be the correct socket.io idiom
          socket.emit('error', msg);
        }
        else
        {
          socket.join(optionalID);
          joinChatRoom(io, socket, optionalID)
        }
        return;
      }
      const vacantRoom = rooms.findVacantRoom(io);
      if(!vacantRoom)
      {
        const msg = "Failed to create a chat room, please try again.";
        console.log(msg);
        // todo: this may/may not be the correct socket.io idiom
        socket.emit('error', msg);
        return;
      }
      socket.join(vacantRoom);
      joinChatRoom(io, socket, vacantRoom);
    });
    socket.on('chat.join', (roomID)=>{
      if(!(roomID in socket.rooms))
      {
        socket.join(roomID);
        joinChatRoom(io,socket,roomID);
      }
    });
  });
}

module.exports = {
  initialiseStorage: initialiseStorage,
  configureServer: configureServer,
  emitChatMessage: emitChatMessage,
  getChatHistory: getChatHistory
};
