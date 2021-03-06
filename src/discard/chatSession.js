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

function constructMessageToSend(roomID, data)
{
  return {
    sender: {
      name: sessionData[roomID].senders.get(data.senderID).name,
      id: sessionData[roomID].senders.get(data.senderID).id
    },
    text: data.text
  };
}

function emitChatMessage(io, roomID, socketID, msg)
{
  const messageToStore = {senderID: socketID, text: msg};
  sessionData[roomID].history.push(messageToStore);
  io.to(roomID).emit(
    'chat.receive',
    constructMessageToSend(roomID, messageToStore)
  );
}

function createChatIfNecessary(roomID)
{
  if(!(roomID in sessionData))
  {
    debug("creating chat " + roomID);
    sessionData[roomID] = {history: new CircularBuffer(100), senders: new Map()};
  }
}

function deleteChatIfNecessary(io, roomID)
{
  if(!io.sockets.adapter.rooms.has(roomID))
  {
    debug("deleting chat " + roomID);
    // room has already been cleared - clear associated data
    delete sessionData[roomID];
  }
}

function joinChatRoom(io, socket, roomID, name)
{
  createChatIfNecessary(roomID);

  const senders = Array.from(sessionData[roomID].senders.values());
  // returns null on failure
  const clientID = rooms.generateStrongID(senders.map(sender=>sender.id));
  if(!clientID)
  {
    console.error("Failed to generate clientID");
    return;
  }
  sessionData[roomID].senders.set(socket.id, {
    id: clientID,
    name: name
  });

  const existingMessages = getChatHistory(roomID);

  socket.on('disconnect', reason => {
    // send update to say player has left
    if(io.sockets.adapter.rooms.has(roomID))
    {
      socket.to(roomID).emit(
        'chat.receive',
        { text: name + " has left." }
      );
    }
    deleteChatIfNecessary(io, roomID);
  });

  socket.on('chat.send', msg => {
    debug("chat.send " + msg + " from " + socket.id);
    emitChatMessage(io, roomID, socket.id, msg);
  });

  for(msg of existingMessages)
  {
    socket.emit('chat.receive', constructMessageToSend(roomID,msg));
  }
  // send update to say player has joined
  socket.emit('chat.receive', {text: 'You have joined room ' + roomID});
  socket.to(roomID).emit(
    'chat.receive',
    {text: name + " has joined."}
  );
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
    if(!socket.rooms.has(roomID) || !(roomID in sessionData))
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
