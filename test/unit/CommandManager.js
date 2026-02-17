const assert = require('assert');

const CommandManager = require('../../src/CommandManager');

describe('CommandManager', () => {
  it('remove(command) removes alias keys for that command', () => {
    const manager = new CommandManager();
    const command = { name: 'look', aliases: ['l', 'lo'] };

    manager.add(command);
    manager.remove(command);

    assert.strictEqual(manager.get('look'), undefined);
    assert.strictEqual(manager.get('l'), undefined);
    assert.strictEqual(manager.get('lo'), undefined);
  });

  it('remove(command) does not remove alias keys now bound to a different command', () => {
    const manager = new CommandManager();
    const first = { name: 'look', aliases: ['l'] };
    const second = { name: 'list', aliases: ['l'] };

    manager.add(first);
    manager.add(second);
    manager.remove(first);

    assert.strictEqual(manager.get('l'), second);
  });
});
