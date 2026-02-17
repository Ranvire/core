const assert = require('assert');

const AreaFactory = require('../../src/AreaFactory');
const EntityFactory = require('../../src/EntityFactory');

describe('EntityFactory', () => {
  it('throws a contract error when clone() is used without overriding create()', () => {
    class BareFactory extends EntityFactory {}
    const factory = new BareFactory();

    assert.throws(() => {
      factory.clone({ area: { name: 'area' }, entityReference: 'area:1' });
    }, error => {
      assert.strictEqual(error instanceof TypeError, true);
      assert.strictEqual(
        error.message,
        'BareFactory must implement create() to support clone()'
      );
      return true;
    });
  });

  it('forwards area and entityReference to subclass create(area, entityRef)', () => {
    class TrackingFactory extends EntityFactory {
      create(area, entityRef) {
        return { area, entityRef };
      }
    }

    const factory = new TrackingFactory();
    const area = { name: 'some-area' };
    const entity = { area, entityReference: 'some-area:10' };
    const created = factory.clone(entity);

    assert.deepStrictEqual(created, { area, entityRef: 'some-area:10' });
  });

  it('throws when clone() is called without an entityReference', () => {
    class TrackingFactory extends EntityFactory {
      create(area, entityRef) {
        return { area, entityRef };
      }
    }

    const factory = new TrackingFactory();

    assert.throws(() => {
      factory.clone({ area: { name: 'a' } });
    }, error => {
      assert.strictEqual(error instanceof TypeError, true);
      assert.strictEqual(
        error.message,
        'clone(entity) requires an entity with entityReference'
      );
      return true;
    });
  });

  it('AreaFactory.clone() continues to clone by area name', () => {
    const factory = new AreaFactory();
    factory.setDefinition('midgaard', { bundle: 'bundle', manifest: {} });
    const area = factory.create('midgaard');
    const clone = factory.clone(area);

    assert.strictEqual(clone.name, 'midgaard');
  });
});
