const humanID = require("human-id");

let randomID = ()=>{
  return humanID.humanId({
    separator: "-",
    capitalize: false
  });
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
