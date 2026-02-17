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
});
