const assert = require('assert');

const { AttributeFormula } = require('../../src/Attribute');
const AttributeFactory = require('../../src/AttributeFactory');

describe('AttributeFactory', () => {
  describe('#create metadata', () => {
    it('does not share metadata references between created instances', () => {
      const factory = new AttributeFactory();
      factory.add('health', 100, null, { tags: { category: 'core' } });

      const a = factory.create('health');
      const b = factory.create('health');

      a.metadata.tags.category = 'modified';

      assert.strictEqual(b.metadata.tags.category, 'core');
    });

    it('does not mutate stored definition metadata when runtime metadata changes', () => {
      const factory = new AttributeFactory();
      factory.add('health', 100, null, { tags: { category: 'core' } });

      const runtime = factory.create('health');
      runtime.metadata.tags.category = 'modified';

      const def = factory.get('health');
      assert.strictEqual(def.metadata.tags.category, 'core');
    });
  });

  describe('#validateAttributes', () => {
    function makeFactory() {
      return new AttributeFactory();
    }

    function formula(requires) {
      return new AttributeFormula(requires, () => 0);
    }

    it('passes when all formula dependencies are defined', () => {
      const factory = makeFactory();
      factory.add('stamina', 100);
      factory.add('maxHealth', 100, formula(['stamina']));

      assert.doesNotThrow(() => factory.validateAttributes());
    });

    it('throws when a formula dependency is missing', () => {
      const factory = makeFactory();
      factory.add('maxHealth', 100, formula(['stamina']));

      assert.throws(() => factory.validateAttributes(), error => {
        assert.match(error.message, /Attribute validation failed: missing formula dependencies:/);
        assert.match(error.message, /\[maxHealth -> stamina\]/);
        return true;
      });
    });

    it('aggregates multiple missing formula dependencies in one error', () => {
      const factory = makeFactory();
      factory.add('maxHealth', 100, formula(['stamina', 'vigor']));
      factory.add('manaRegen', 5, formula(['spirit']));

      assert.throws(() => factory.validateAttributes(), error => {
        assert.match(error.message, /Attribute validation failed: missing formula dependencies:/);
        assert.match(error.message, /\[maxHealth -> stamina\]/);
        assert.match(error.message, /\[maxHealth -> vigor\]/);
        assert.match(error.message, /\[manaRegen -> spirit\]/);
        return true;
      });
    });

    it('still throws for circular dependencies', () => {
      const factory = makeFactory();
      factory.add('health', 100, formula(['vigor']));
      factory.add('vigor', 10, formula(['health']));

      assert.throws(() => factory.validateAttributes(), /circular dependency/);
    });
  });
});
