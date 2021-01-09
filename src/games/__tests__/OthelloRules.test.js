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
