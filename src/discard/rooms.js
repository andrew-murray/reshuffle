const crypto = require('crypto');

const randomID = () =>
{
  return crypto.randomBytes(20).toString('hex');
};

const findVacantRoom = (io)=>
{
  let roomID = randomID();
  let attempt = 0;
  while(io.sockets.adapter.rooms.get(roomID))
  {
    roomID = randomID();
    attempt++;
    if(attempt == 10)
    {
      // assume something has gone wrong and terminate
      return null;
    }
  }
  return roomID;
};

module.exports = {
  randomID: randomID,
  findVacantRoom: findVacantRoom
};
