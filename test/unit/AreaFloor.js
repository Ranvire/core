const assert = require('assert');
const AreaFloor = require('../../src/AreaFloor');

describe('AreaFloor', () => {
  it('accepts negative coordinates and returns room at those coordinates', () => {
    const floor = new AreaFloor(0);
    const room = { entityReference: 'room-1' };

    floor.addRoom(-2, -3, room);

    assert.equal(floor.getRoom(-2, -3), room);
  });

  it('tracks low/high bounds when negative coordinates are used', () => {
    const floor = new AreaFloor(0);

    floor.addRoom(-4, -1, { entityReference: 'room-a' });
    floor.addRoom(2, 3, { entityReference: 'room-b' });

    assert.equal(floor.lowX, -4);
    assert.equal(floor.highX, 2);
    assert.equal(floor.lowY, -1);
    assert.equal(floor.highY, 3);
  });
});
