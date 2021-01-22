const CircularBuffer = require("circular-buffer");
const rooms = require("./rooms");
const debug = require("debug")("chat");

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
    debug("creating chat " + roomID);
    sessionData[roomID] = {history: new CircularBuffer(100), names: {}};
  }
}

function deleteChatIfNecessary(io, roomID)
{
  if(!io.sockets.adapter.rooms.get(roomID))
  {
    debug("deleting chat " + roomID);
    // room has already been cleared - clear associated data
    delete sessionData[roomID];
  }
}

function joinChatRoom(io, socket, roomID, name)
{
  createChatIfNecessary(roomID);

  sessionData[roomID].names[socket.id] = name;

  const existingMessages = getChatHistory(roomID);

  socket.on('disconnect', reason => {
    deleteChatIfNecessary(io, roomID);
  });

  socket.on('chat.message', msg => {emitChatMessage(io, roomID, msg);});

  for(msg of existingMessages)
  {
    socket.emit('chat.message', msg);
  }
}

function subscribe(io,socket)
{
  socket.on('chat.create', (optionalID) => {
    debug("socket " + socket.id + " requested to create " + optionalID ? optionalID : "");
    if(optionalID)
    {
      if(socket.rooms.has(optionalID))
      {
        return;
      }
      if(io.sockets.adapter.rooms.get(optionalID))
      {
        const msg = "Attempted to create a room that already exists";
        console.error(msg);
        // todo: this may/may not be the correct socket.io idiom
        socket.emit('error', msg);
      }
      return;
    }
    const vacantRoom = rooms.findVacantRoom(io);
    if(!vacantRoom)
    {
      const msg = "Failed to create a chat room, please try again.";
      console.error(msg);
      // todo: this may/may not be the correct socket.io idiom
      socket.emit('error', msg);
      return;
    }
    debug("created " + vacantRoom);
    socket.emit("room.created", vacantRoom);
  });

  socket.on('chat.join', (roomID, name)=>{
    debug("socket " + socket.id + " requested to join " + roomID );
    if(!socket.rooms.has(roomID))
    {
      socket.join(roomID);
      joinChatRoom(io,socket,roomID,name);
    }
  });
}

module.exports = {
  initialiseStorage: initialiseStorage,
  subscribe: subscribe,
  emitChatMessage: emitChatMessage,
  getChatHistory: getChatHistory
};
