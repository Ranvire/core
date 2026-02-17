const assert = require('assert');
const EventEmitter = require('events');

const EffectFactory = require('../../src/EffectFactory');
const EffectList = require('../../src/EffectList');

describe('EffectList', () => {
  describe('deactivated effects', () => {
    it('does not apply attribute modifiers when effect is deactivated', () => {
      const factory = new EffectFactory();
      factory.add('inactive-attr', {
        config: { type: 'inactive-attr' },
        modifiers: {
          attributes: {
            health: current => current + 10,
          },
        },
        listeners: {},
      });

      const list = new EffectList(new EventEmitter(), []);
      const effect = factory.create('inactive-attr');
      list.add(effect);
      effect.deactivate();

      const modified = list.evaluateAttribute({ name: 'health', base: 5 });
      assert.strictEqual(modified, 5);
    });

    it('does not apply damage modifiers when effect is deactivated', () => {
      const factory = new EffectFactory();
      factory.add('inactive-damage', {
        config: { type: 'inactive-damage' },
        modifiers: {
          incomingDamage: (_damage, current) => current + 7,
          outgoingDamage: (_damage, current) => current + 9,
        },
        listeners: {},
      });

      const list = new EffectList(new EventEmitter(), []);
      const effect = factory.create('inactive-damage');
      list.add(effect);
      effect.deactivate();

      assert.strictEqual(list.evaluateIncomingDamage({}, 10), 10);
      assert.strictEqual(list.evaluateOutgoingDamage({}, 10), 10);
    });
  });

  describe('paused effects', () => {
    it('does not apply damage modifiers when effect is paused', () => {
      const factory = new EffectFactory();
      factory.add('paused-damage', {
        config: { type: 'paused-damage' },
        modifiers: {
          incomingDamage: (_damage, current) => current + 7,
          outgoingDamage: (_damage, current) => current + 9,
        },
        listeners: {},
      });

      const list = new EffectList(new EventEmitter(), []);
      const effect = factory.create('paused-damage');

      const realNow = Date.now;
      let now = 1000;
      Date.now = () => now;
      try {
        list.add(effect);
        now = 1010;
        effect.pause();
      } finally {
        Date.now = realNow;
      }

      assert.strictEqual(list.evaluateIncomingDamage({}, 10), 10);
      assert.strictEqual(list.evaluateOutgoingDamage({}, 10), 10);
    });
  });
});
