const assert = require('assert');

const Attributes = require('../../src/Attributes');
const { Attribute } = require('../../src/Attribute');
const Character = require('../../src/Character');

describe('Character attributeUpdate payload', () => {
  function makeCharacter(base = 100, delta = 0) {
    const attributes = new Attributes();
    attributes.add(new Attribute('health', base, delta));

    return new Character({
      name: 'Tester',
      attributes,
      effects: [],
    });
  }

  function expectAttributeUpdate(methodName, initialBase, initialDelta, invoke, expected) {
    const character = makeCharacter(initialBase, initialDelta);
    let payload;
    character.once('attributeUpdate', (...args) => {
      payload = args;
    });

    invoke(character);

    assert.ok(payload, `${methodName} should emit attributeUpdate`);
    assert.strictEqual(payload[0], 'health');
    assert.strictEqual(payload[1], expected.current);
    assert.deepStrictEqual(payload[2], {
      name: 'health',
      base: expected.base,
      max: expected.max,
      current: expected.current,
      delta: expected.delta,
    });
  }

  it('setAttributeToMax emits (name, current, snapshot)', () => {
    expectAttributeUpdate(
      'setAttributeToMax',
      100,
      -30,
      character => character.setAttributeToMax('health'),
      { base: 100, max: 100, current: 100, delta: 0 }
    );
  });

  it('raiseAttribute emits (name, current, snapshot)', () => {
    expectAttributeUpdate(
      'raiseAttribute',
      100,
      -20,
      character => character.raiseAttribute('health', 5),
      { base: 100, max: 100, current: 85, delta: -15 }
    );
  });

  it('lowerAttribute emits (name, current, snapshot)', () => {
    expectAttributeUpdate(
      'lowerAttribute',
      100,
      0,
      character => character.lowerAttribute('health', 10),
      { base: 100, max: 100, current: 90, delta: -10 }
    );
  });

  it('setAttributeBase emits (name, current, snapshot)', () => {
    expectAttributeUpdate(
      'setAttributeBase',
      100,
      -10,
      character => character.setAttributeBase('health', 120),
      { base: 120, max: 120, current: 110, delta: -10 }
    );
  });
});
