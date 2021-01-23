const rewire = require("rewire");
let rooms = rewire("../rooms");

describe('strongIDs', () => {
  test('should not collide', () => {
    // monkey-patch a silly id-generator
    let index = 0;
    const fruit = ["apple", "orange", "pear"];
    const generator = () => {
      return fruit[index++ % 3];
    };

    const revert = rooms.__set__("generateSingleStrongID", generator);
    expect(fruit.indexOf(rooms.generateStrongID())).toBe(0);
    expect(fruit.indexOf(rooms.generateStrongID())).toBe(1);
    expect(fruit.indexOf(rooms.generateStrongID())).toBe(2);

    expect(rooms.generateStrongID(["apple", "pear"])).toBe("orange");
    expect(rooms.generateStrongID(["pear", "apple"])).toBe("orange");
    expect(rooms.generateStrongID(["pear", "pears", "OJ", "orange"])).toBe("apple");

    expect(()=>{rooms.generateStrongID(fruit)}).toBe(null);
    revert();
  })
})
