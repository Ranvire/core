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

  it('lockDoor sets both locked and closed to true', () => {
    const area = makeArea();
    const fromRoom = makeRoom(area, 1);
    const room = makeRoom(area, 2, { 'area:1': {} });

    room.lockDoor(fromRoom);
    const door = room.getDoor(fromRoom);

    assert.strictEqual(door.locked, true);
    assert.strictEqual(door.closed, true);
  });

  it('unlockDoor sets locked to false', () => {
    const area = makeArea();
    const fromRoom = makeRoom(area, 1);
    const room = makeRoom(area, 2, { 'area:1': { locked: true, closed: true } });

    room.unlockDoor(fromRoom);

    assert.strictEqual(room.getDoor(fromRoom).locked, false);
    assert.strictEqual(room.isDoorLocked(fromRoom), false);
  });

  it('door methods are no-op when door key is missing', () => {
    const area = makeArea();
    const fromRoom = makeRoom(area, 1);
    const room = makeRoom(area, 2, {});

    assert.doesNotThrow(() => room.openDoor(fromRoom));
    assert.doesNotThrow(() => room.closeDoor(fromRoom));
    assert.doesNotThrow(() => room.lockDoor(fromRoom));
    assert.doesNotThrow(() => room.unlockDoor(fromRoom));
    assert.strictEqual(room.getDoor(fromRoom), undefined);
    assert.strictEqual(room.isDoorLocked(fromRoom), false);
  });

  it('mutating runtime door state does not mutate original room definition doors', () => {
    const area = makeArea();
    const fromRoom = makeRoom(area, 1);
    const doors = { 'area:1': {} };
    const room = makeRoom(area, 2, doors);

    room.lockDoor(fromRoom);

    assert.strictEqual(doors['area:1'].locked, undefined);
    assert.strictEqual(doors['area:1'].closed, undefined);
  });
});
