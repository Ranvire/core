const assert = require('assert');

const EffectFactory = require('../../src/EffectFactory');

describe('EffectFactory', () => {
  describe('#get', () => {
    it('returns a registered effect definition by id', () => {
      const factory = new EffectFactory();
      factory.add('burn', {
        config: { name: 'Burning' },
        state: { stacks: 1 },
        listeners: {},
      });

      const definition = factory.get('burn');

      assert.deepStrictEqual(definition, {
        config: { name: 'Burning' },
        state: { stacks: 1 },
      });
    });
  });

  describe('#create', () => {
    it('does not leak config overrides into subsequent instances', () => {
      const factory = new EffectFactory();
      factory.add('burn', {
        config: { name: 'Burning', potency: 5 },
        state: { stacks: 1 },
        listeners: {},
      });

      const first = factory.create('burn', { potency: 99 });
      assert.strictEqual(first.config.potency, 99);

      const second = factory.create('burn');
      assert.strictEqual(second.config.potency, 5);
    });

    it('does not leak state overrides into subsequent instances', () => {
      const factory = new EffectFactory();
      factory.add('burn', {
        config: { name: 'Burning' },
        state: { stacks: 1 },
        listeners: {},
      });

      const first = factory.create('burn', {}, { stacks: 7 });
      assert.strictEqual(first.state.stacks, 7);

      const second = factory.create('burn');
      assert.strictEqual(second.state.stacks, 1);
    });
  });
});
