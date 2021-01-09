
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
  if(role !== labels.black && role !== labels.white)
  {
    throw Error(
      "Invalid player provided to opponentForPlayer: " + role.toString()
    );
  }
  return role === labels.black ? labels.white : labels.black;
};

const isGameCoordinate = (game, pos) => {
  return (
    game.length >= 1 && // sanity check
    0 <= pos[0] &&
    pos[0] < game.length &&
    0 <= pos[1] &&
    pos[1] < game[0].length
  );
};

const addPositions = (pos1,pos2) => {
  return [pos1[0] + pos2[0], pos1[1] + pos2[1]];
};

const scaleOffset = (pos, scale) => {
  return [pos[0] * scale, pos[1] * scale];
}

const comparePosition = (a,b) => {
  // negative value <=> a < b
  // positive value <=> a > b
  // 0 <=> a == b
  if( a[0] !== b[0] )
  {
    return a[0] < b[0] ? -1 : +1;
  }
  else if( a[1] !== b[1] )
  {
    return a[1] < b[1] ? -1 : +1;
  }
  else
  {
    return 0;
  }
};

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
      let tokenRangeEnd = null;
      for(var i = 2; i < 8; ++i)
      {
        const positionToFlip = addPositions( pos, scaleOffset(offset, i) );
        if(!isGameCoordinate(game, positionToFlip))
        {
          // reached the end of the board, haven't found a valid range to flip
          break;
        }
        else if( game[positionToFlip[0]][positionToFlip[1]] === role )
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
        for(var i = 1; i < tokenRangeEnd; ++i)
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
  if(changes.length === 0)
  {
    return [];
  }
  // note we include the played upon square in the list of changes
  // we handle that here, so that it isn't included at the end of multiple ranges
  changes.push( {
    position: pos,
    outcome: role
  } );
  changes.sort((a,b)=>comparePosition(a.position, b.position));
  return changes;
};

const canPlay = (game, role, pos) => {
    if(game[pos[0]][pos[1]] !== labels.empty)
    {
        return false;
    }
    const changes = changesFromPlay(game, role, pos);
    // othello rules dictate the only plays you can make
    // are those which change opposing pieces
    return changes.length > 0;
};

const createBoardStateWithMove = (game, position, role) => {
  let mutatedGame = [];
  for(const rowIndex of [...Array(game.length).keys()])
  {
    if(rowIndex === position[0])
    {
      let mutatedRow = Array.from(game[rowIndex]);
      mutatedRow[position[1]] = role;
      mutatedGame.push(mutatedRow);
    }
    else
    {
      mutatedGame.push(Array.from(game[rowIndex]));
    }
  }
  return mutatedGame;
}

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

const changesForAllPositions = (game, role) => {
  if(game.length === 0)
  {
    return [];
  }
  let results = [];
  for(const y of [...Array(game.length).keys()])
  {
    for(const x of [...Array(game[0].length).keys()])
    {
      const changes = changesFromPlay(game, role, [y,x]);
      if(changes.length > 0)
      {
        results.push({position: [y,x], changeset: changes});
      }
    }
  }
  return results;
}

export default {
  canPlay,
  changesForAllPositions,
  comparePosition,
  createBoardStateWithMove,
  createInitialBoardState,
  changesFromPlay,
  isGameCoordinate,
  opponentForPlayer,
  labels
};
