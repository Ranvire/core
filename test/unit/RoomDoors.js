const assert = require('assert');

const Room = require('../../src/Room');

describe('Room door state normalization', () => {
  function makeArea() {
    return {
      name: 'area',
      addNpc: () => {},
      getRoomAtCoordinates: () => null,
    };
  }

  function makeRoom(area, id, doors) {
    return new Room(area, {
      id,
      title: `Room ${id}`,
      description: 'test',
      doors,
    });
  }

  it('normalizes missing locked/closed flags to false', () => {
    const area = makeArea();
    const fromRoom = makeRoom(area, 1);
    const room = makeRoom(area, 2, { 'area:1': {} });

    const door = room.getDoor(fromRoom);

    assert.strictEqual(door.locked, false);
    assert.strictEqual(door.closed, false);
  });

  it('isDoorLocked returns false when door has no locked flag', () => {
    const area = makeArea();
    const fromRoom = makeRoom(area, 1);
    const room = makeRoom(area, 2, { 'area:1': {} });

    assert.strictEqual(room.isDoorLocked(fromRoom), false);
  });
});
