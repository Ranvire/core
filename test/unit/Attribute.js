const assert = require('assert');
const { Attribute } = require('../../src/Attribute');

describe('Basic Attribute',  () => {
  describe('#constructor', () => {
    it('should clamp positive delta to 0', () => {
      const attr = new Attribute('test', 10, 5);
      assert.equal(attr.delta, 0);
    });

    it('should preserve negative delta', () => {
      const attr = new Attribute('test', 10, -5);
      assert.equal(attr.delta, -5);
    });

    it('should reject numeric string base values', () => {
      assert.throws(() => new Attribute('test', '10'), /Base attribute must be a number/);
    });

    it('should reject numeric string delta values', () => {
      assert.throws(() => new Attribute('test', 10, '2'), /Attribute delta must be a number/);
    });

    it('should reject non-finite base values', () => {
      assert.throws(() => new Attribute('test', Infinity), /Base attribute must be a number/);
      assert.throws(() => new Attribute('test', NaN), /Base attribute must be a number/);
    });

    it('should reject non-finite delta values', () => {
      assert.throws(() => new Attribute('test', 10, Infinity), /Attribute delta must be a number/);
      assert.throws(() => new Attribute('test', 10, NaN), /Attribute delta must be a number/);
    });
  });

  let attribute = null;
  const base = 10;
  beforeEach(() => {
    attribute = new Attribute('test', base);
  });

  describe('#setBase', () => {
    it('should update base value', () => {
      assert.equal(attribute.base, base);
      attribute.setBase(50);
      assert.equal(attribute.base, 50);
    });

    it('should not allow negative base', () => {
      attribute.setBase(-100);
      assert.equal(attribute.base, 0);
    });
  });

  describe('#lower', () => {
    it('should lower delta', () => {
      attribute.lower(5);
      assert.equal(attribute.delta, -5);
    });
  });

  describe('#raise', () => {
    it('should raise delta', () => {
      attribute.lower(5);
      attribute.raise(2);
      assert.equal(attribute.delta, -3);
    });

    it('should not allow raising delta above 0', () => {
      attribute.lower(10);
      assert.equal(attribute.delta, -10);
      attribute.raise(100);
      assert.equal(attribute.delta, 0);
    });
  });
});
