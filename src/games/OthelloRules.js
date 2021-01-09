
const labels = {
    empty: 0,
    black: 1,
    white: 2
};

const NEIGHBOUR_OFFSETS = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1]
];

const opponentForPlayer = (role) => {
  if(role !== labels.black || role !== labels.white)
  {
    throw Error(
      "Invalid player provided to opponentForPlayer: " + role.toString()
    );
  }
  return role === BLACK ? WHITE : BLACK;
};

const isGameCoordinate = (game, pos) => {
  return (
    game.length >= 1 && // sanity check
    0 <= pos[0] &&
    pos[0] < game.length &&
    0 <= pos[1] &&
    pos[1] < game[0].length
  )
};

const addPositions = (pos1,pos2) => {
  return [pos1[0] + pos2[0], pos1[1] + pos2[1]];
};

const scaleOffset = (pos, scale) => {
  return [pos[0] * scale, pos[1] * scale];
}

const changesFromPlay = (game, role, pos) =>
{
  if(game[pos[0]][pos[1]] == labels.white || game[pos[0]][pos[1]] == labels.black)
  {
    return {};
  }
  const opponent = opponentForPlayer(role);
  const gameWidth = game[0].length;
  const gameHeight = game.length;
  let changes = [];
  for(const offset of NEIGHBOUR_OFFSETS)
  {
    const adjPos = addPositions(pos, offset);
    if(isGameCoordinate(game, adjPos) && game[adjPos[0]][adjPos[1]] === opponent)
    {
      const boundaryDistances = [
        offset[0] < 0 ? pos[0] : ( offset[0] > 0 ? gameHeight - pos[0] - 1 : Infinity),
        offset[1] < 0 ? pos[1] : ( offset[1] > 0 ? gameWidth - pos[1] - 1 : Infinity)
      ];
      const distanceToBoundary = Math.min(boundaryDistances);
      let tokenRangeEnd = null;
      for(var i = 2; i < distanceToBoundary + 1; ++i)
      {
        const positionToFlip = addPositions( pos, scaleOffset(offset, i) );
        if( game[positionToFlip[0]][positionToFlip[1]] === role )
        {
          // reached the end of a valid array of tokens to flip
          tokenRangeEnd = i;
          break;
        }
        else if( game[positionToFlip[0]][positionToFlip[1]] === opponent )
        {
          // still covering a valid array of opponent's pieces, continue
          continue;
        }
        else
        {
          // reached the end of a range of opponent's pieces and met an empty square
          // player == role will not "enclose" this range, no changes are valid
          break;
        }
      }

      // populate changes based on the assessed range, could be handled
      // inside the loop instead
      if(tokenRangeEnd)
      {
        // note we include the played upon square in the list of changes
        for(var i = 0; i < tokenRangeEnd; ++i)
        {
          const positionToFlip = addPositions( pos, scaleOffset(offset, i) );
          changes.push( {
            position: positionToFlip,
            outcome: role
          } );
        }
      }
    }
  }
  if(!changes)
  {
    return {};
  }
  return changes;
};

const canPlay = (game, role, pos) => {
    if(game[pos[0], pos[1]] !== labels.empty)
    {
        return false;
    }
    const changes = changesFromPlay(game, role, pos);
    // othello rules dictate the only plays you can make
    // are those which change opposing pieces
    return changes.length > 0;
};

const createInitialBoardState = () => {
  const e = labels.empty;
  const w = labels.white;
  const b = labels.black;
  return [
    [e,e,e,e,e,e,e,e],
    [e,e,e,e,e,e,e,e],
    [e,e,e,e,e,e,e,e],
    [e,e,e,b,w,e,e,e],
    [e,e,e,w,b,e,e,e],
    [e,e,e,e,e,e,e,e],
    [e,e,e,e,e,e,e,e],
    [e,e,e,e,e,e,e,e]
  ];
};

export default {
  createInitialBoardState,
  canPlay,
  changesFromPlay,
  isGameCoordinate,
  opponentForPlayer,
  labels
};
