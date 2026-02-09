'use strict';

const assert = require('assert');
const path = require('path');
const Module = require('module');

const coreRoot = path.resolve(__dirname, '..', '..');
const indexPath = path.join(coreRoot, 'index.js');
const loggerPath = path.join(coreRoot, 'src', 'Logger.js');

function withLoadTracking(run) {
  const originalLoad = Module._load;
  const state = { longjohnRequested: false };

  Module._load = function (request, parent, isMain) {
    if (request === 'longjohn') {
      state.longjohnRequested = true;
      return {};
    }
    if (request === 'pretty-error') {
      return {
        start() {
          return { skipNodeFiles() { } };
        },
      };
    }

    return originalLoad.apply(this, arguments);
  };

  try {
    run(state);
  } finally {
    Module._load = originalLoad;
  }

  return state;
}

describe('Longjohn loading', function () {
  it('does not require longjohn during default core load', function () {
    delete require.cache[require.resolve(indexPath)];

    const state = withLoadTracking(() => {
      require(indexPath);
    });

    assert.strictEqual(
      state.longjohnRequested,
      false,
      'expected no longjohn load during default core load'
    );
  });
});
