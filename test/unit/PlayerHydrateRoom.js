const assert = require('assert');
const EventEmitter = require('events');

const Logger = require('../../src/Logger');
const Player = require('../../src/Player');

function makeRoom(entityReference) {
  const room = new EventEmitter();
  room.entityReference = entityReference;
  room.players = new Set();
  room.addPlayer = player => room.players.add(player);
  room.removePlayer = player => room.players.delete(player);
  return room;
}

function makeState(placeholderRoom) {
  return {
    AreaManager: {
      getPlaceholderArea: () => ({
        getRoomById: id => {
          assert.strictEqual(id, 'placeholder');
          return placeholderRoom;
        },
      }),
    },
    RoomManager: {
      getRoom: () => null,
    },
  };
}

function makePlayer(data = {}) {
  return new Player(Object.assign({
    name: 'Tester',
    password: 'secret',
    inventory: {
      max: 5,
      items: [],
    },
    quests: {
      active: [],
      completed: [],
    },
    effects: [],
    equipment: new Map(),
  }, data));
}

describe('Player hydrate room recovery', () => {
  let originalError;

  beforeEach(() => {
    originalError = Logger.error;
  });

  afterEach(() => {
    Logger.error = originalError;
  });

  it('repairs null room to placeholder room and logs an error', () => {
    const placeholderRoom = makeRoom('placeholder:placeholder');
    const player = makePlayer({ room: null });
    const errors = [];

    Logger.error = (...args) => errors.push(args.join(' '));

    player.hydrate(makeState(placeholderRoom));

    assert.strictEqual(player.room, placeholderRoom);
    assert.strictEqual(placeholderRoom.players.has(player), true);
    assert.strictEqual(errors.length > 0, true);
  });

  it('repairs missing room to placeholder room and logs an error', () => {
    const placeholderRoom = makeRoom('placeholder:placeholder');
    const player = makePlayer();
    const errors = [];

    Logger.error = (...args) => errors.push(args.join(' '));

    player.hydrate(makeState(placeholderRoom));

    assert.strictEqual(player.room, placeholderRoom);
    assert.strictEqual(placeholderRoom.players.has(player), true);
    assert.strictEqual(errors.length > 0, true);
  });
});
