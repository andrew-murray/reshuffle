import OthelloRules from "../OthelloRules";

test('check othello constants', () => {
  // regression test, we only need to require that these are distinct
  // but let's enforce that they're this, it needs to be the same for client/server
  expect(OthelloRules.labels.empty).toBe(0);
  expect(OthelloRules.labels.black).toBe(1);
  expect(OthelloRules.labels.white).toBe(2);
});

test('check othello board initialisation', () => {
  const state = OthelloRules.createInitialBoardState();
  expect(state.length).toBe(8);
  for(const row of state)
  {
    expect(row.length).toBe(8);
  }

  for(const y of [...Array(8).keys()])
  {
    for(const x of [...Array(8).keys()])
    {
      if( ( x === 3 && y === 3) || ( x === 4 && y === 4) )
      {
        expect(state[y][x]).toBe(OthelloRules.labels.black);
      }
      else if( ( x === 3 && y === 4) || ( x === 4 && y === 3) )
      {
        expect(state[y][x]).toBe(OthelloRules.labels.white);
      }
      else
      {
        expect(state[y][x]).toBe(OthelloRules.labels.empty);
      }
    }
  }
});

const sortPositions = (posArray) =>
{
  let arrayCopy = Array.from(posArray);
  arrayCopy.sort(OthelloRules.comparePosition);
  return arrayCopy;
};

const testExpectedMoves = (boardState, role, validMoves) =>
{
  for(const y of [...Array(8).keys()])
  {
    for(const x of [...Array(8).keys()])
    {
      const validMovesForPos = validMoves.filter(
        move => move.position[0] === y && move.position[1] === x
      );

      expect(validMovesForPos.length === 0 || validMovesForPos.length === 1).toBe(true);

      const expectMoveToBeValid = validMovesForPos.length === 1;

      const canPlayMove = OthelloRules.canPlay(
        boardState,
        role,
        [y,x]
      );
      // todo: https://www.npmjs.com/package/jest-expect-message
      // console.log([y,x]);
      expect(canPlayMove).toBe(expectMoveToBeValid);

      if(canPlayMove && expectMoveToBeValid)
      {
        const calculatedChanges = OthelloRules.changesFromPlay(
          boardState,
          role,
          [y,x]
        );
        const calculatedPositions = sortPositions(calculatedChanges.map(x=>x.position));
        const expectedPositions = sortPositions(validMovesForPos[0].changes);

        // console.log([y,x]);
        expect(calculatedPositions).toEqual(expectedPositions);
      }
    }
  }
};

test('check othello - get moves - simple test board - white', () => {
    const e = OthelloRules.labels.empty;
    const W = OthelloRules.labels.white;
    const B = OthelloRules.labels.black;

    // note that this isn't a board state
    // that could be reached through normal play
    // but it covers lots of cases

    const boardState = [
    // 0,1,2,3,4,5,6,7
      [e,e,e,e,e,e,e,e], // 0
      [e,e,e,e,e,e,e,e], // 1
      [e,e,W,W,W,e,e,e], // 2
      [e,W,B,B,B,e,e,B], // 3
      [e,e,B,B,B,e,e,B], // 4
      [e,e,e,e,e,e,e,B], // 5
      [W,W,e,e,e,e,e,B], // 6
      [e,W,B,e,e,e,e,e]  // 7
    ];

    const validMovesWhite = [
      // middle chunk
      {position: [3,5], changes: [ [3,2], [3,3], [3,4], [3,5] ]},

      {position: [4,1], changes: [ [3,2], [4,1] ]},
      {position: [4,5], changes: [ [3,4], [4,5] ]},

      {position: [5,1], changes: [ [3,3], [4,2], [5,1] ] },
      {position: [5,2], changes: [ [3,2], [4,2], [5,2] ] },
      {position: [5,3], changes: [ [3,3], [4,2], [4,3], [5,3] ] },
      {position: [5,4], changes: [ [3,4], [4,4], [5,4] ] },
      {position: [5,5], changes: [ [3,3], [4,4], [5,5] ] },
      // lower-left quadrant
      {position: [7,3], changes: [ [7,2], [7,3] ] },
    ];

    testExpectedMoves(boardState, OthelloRules.labels.white, validMovesWhite);
});

test('check othello - get moves - simple test board - black', () => {
    const e = OthelloRules.labels.empty;
    const W = OthelloRules.labels.white;
    const B = OthelloRules.labels.black;

    // (same board state as test above)
    // note that this isn't a board state
    // that could be reached through normal play
    // but it covers lots of cases

    const boardState = [
    // 0,1,2,3,4,5,6,7
      [e,e,e,e,e,e,e,e], // 0
      [e,e,e,e,e,e,e,e], // 1
      [e,e,W,W,W,e,e,e], // 2
      [e,W,B,B,B,e,e,B], // 3
      [e,e,B,B,B,e,e,B], // 4
      [e,e,e,e,e,e,e,B], // 5
      [W,W,e,e,e,e,e,B], // 6
      [e,W,B,e,e,e,e,e]  // 7
    ];

    const validMovesBlack = [
      // middle chunk
      {position: [1,1], changes: [ [1,1], [2,2] ] },
      {position: [1,2], changes: [ [1,2], [2,2], [2,3] ] },
      {position: [1,3], changes: [ [1,3], [2,3] ] },
      {position: [1,4], changes: [ [1,4], [2,3], [2,4] ] },
      {position: [1,5], changes: [ [1,5], [2,4] ] },

      {position: [2,0], changes: [ [2,0], [3,1] ] },
      {position: [3,0], changes: [ [3,0], [3,1] ] },

      // lower-left quadrant
      {position: [5,0], changes: [ [5,0], [6,1] ] },
      {position: [7,0], changes: [ [7,0], [7,1] ] }
    ];

    testExpectedMoves(boardState, OthelloRules.labels.black, validMovesBlack);
});
