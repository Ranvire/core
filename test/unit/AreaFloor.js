const assert = require('assert');
const AreaFloor = require('../../src/AreaFloor');

describe('AreaFloor', () => {
  it('uses Map-backed coordinate storage', () => {
    const floor = new AreaFloor(0);
    const room = { entityReference: 'room-1' };

    floor.addRoom(-2, -3, room);

    assert.ok(floor.map instanceof Map);
    assert.ok(floor.map.get(-2) instanceof Map);
    assert.equal(floor.map.get(-2).get(-3), room);
  });

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

  it('allows removing and re-adding at the same coordinate', () => {
    const floor = new AreaFloor(0);
    const roomA = { entityReference: 'room-a' };
    const roomB = { entityReference: 'room-b' };

    floor.addRoom(1, 2, roomA);
    floor.removeRoom(1, 2);
    floor.addRoom(1, 2, roomB);

    assert.equal(floor.getRoom(1, 2), roomB);
  });

  it('retrieves rooms from mixed positive and negative coordinates', () => {
    const floor = new AreaFloor(0);
    const roomA = { entityReference: 'room-a' };
    const roomB = { entityReference: 'room-b' };
    const roomC = { entityReference: 'room-c' };
    const roomD = { entityReference: 'room-d' };

    floor.addRoom(-5, 4, roomA);
    floor.addRoom(6, -7, roomB);
    floor.addRoom(-8, -9, roomC);
    floor.addRoom(10, 11, roomD);

    assert.equal(floor.getRoom(-5, 4), roomA);
    assert.equal(floor.getRoom(6, -7), roomB);
    assert.equal(floor.getRoom(-8, -9), roomC);
    assert.equal(floor.getRoom(10, 11), roomD);
  });
});
