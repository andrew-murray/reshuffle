const humanID = require("human-id");
const crypto = require("crypto");

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

function generateSingleStrongID()
{
  return crypto.randomBytes(16).toString("hex");
}

let MAX_FAILURES = 10;

function generateStrongID(collisions)
{
  let candidate = generateSingleStrongID();
  if(collisions)
  {
    const collisionSet = new Set(collisions);
    let failures = 0;
    while(collisionSet.has(candidate))
    {
      candidate = generateSingleStrongID();
      failures++;
      if(failures === MAX_FAILURES)
      {
        return null;
      }
    }
  }
  return candidate;
}

module.exports = {
  generateSingleStrongID: generateSingleStrongID,
  generateStrongID: generateStrongID,
  randomID: randomID,
  findVacantRoom: findVacantRoom
};
