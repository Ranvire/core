'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const BundleManager = require('../../src/BundleManager');
const Logger = require('../../src/Logger');

function withStubbedLoggerWarn(run) {
  const warnCalls = [];
  const originalWarn = Logger.warn;
  Logger.warn = (...args) => warnCalls.push(args.join(' '));

  const finish = () => {
    Logger.warn = originalWarn;
    return warnCalls;
  };

  try {
    const result = run(warnCalls);
    if (result && typeof result.then === 'function') {
      return result.then(() => finish(), err => {
        finish();
        throw err;
      });
    }

    return finish();
  } catch (err) {
    finish();
    throw err;
  }
}

describe('BundleManager warnings', () => {
  it('includes bundle and area in invalid entity data warnings', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-warn-'));
    const loader = {
      setBundle: () => {},
      setArea: () => {},
      hasData: async () => true,
      fetchAll: async () => null,
    };
    const state = {
      EntityLoaderRegistry: { get: () => loader },
    };
    const manager = new BundleManager(tempDir, state);

    const warnCalls = await withStubbedLoggerWarn(() => (
      manager.loadEntities('example-bundle', 'example-area', 'items', { createEntityRef: () => '', setDefinition: () => {} })
    ));

    assert.strictEqual(warnCalls.length, 1, 'expected a single warning');
    assert.ok(warnCalls[0].includes('example-bundle'), 'expected bundle name in warning');
    assert.ok(warnCalls[0].includes('example-area'), 'expected area name in warning');

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('includes bundle and a placeholder area when area is missing', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-warn-'));
    const loader = {
      setBundle: () => {},
      setArea: () => {},
      hasData: async () => true,
      fetchAll: async () => null,
    };
    const state = {
      EntityLoaderRegistry: { get: () => loader },
    };
    const manager = new BundleManager(tempDir, state);

    const warnCalls = await withStubbedLoggerWarn(() => (
      manager.loadEntities('example-bundle', undefined, 'items', { createEntityRef: () => '', setDefinition: () => {} })
    ));

    assert.strictEqual(warnCalls.length, 1, 'expected a single warning');
    assert.ok(warnCalls[0].includes('example-bundle'), 'expected bundle name in warning');
    assert.ok(
      warnCalls[0].toLowerCase().includes('unknown'),
      'expected unknown area placeholder in warning'
    );

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('includes bundle and area in missing entity script warnings', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-warn-'));
    const loader = {
      setBundle: () => {},
      setArea: () => {},
      hasData: async () => true,
      fetchAll: async () => ([{ id: 'shortsword', script: 'missing-script' }]),
    };
    const state = {
      EntityLoaderRegistry: { get: () => loader },
    };
    const factory = {
      createEntityRef: (areaName, id) => `${areaName}:${id}`,
      setDefinition: () => {},
    };
    const manager = new BundleManager(tempDir, state);

    const warnCalls = await withStubbedLoggerWarn(() => (
      manager.loadEntities('example-bundle', 'example-area', 'items', factory)
    ));

    assert.strictEqual(warnCalls.length, 1, 'expected a single warning');
    assert.ok(warnCalls[0].includes('example-bundle'), 'expected bundle name in warning');
    assert.ok(warnCalls[0].includes('example-area'), 'expected area name in warning');
    assert.ok(warnCalls[0].includes('shortsword'), 'expected entity id in warning');

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('includes bundle and area in missing area script warnings', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-warn-'));
    const state = {
      EntityLoaderRegistry: { get: () => ({}) },
      AreaFactory: { setDefinition: () => {} },
    };
    const manager = new BundleManager(tempDir, state);
    manager.loadQuests = async () => [];
    manager.loadEntities = async () => [];
    manager.loadEntityScript = () => {};

    const warnCalls = await withStubbedLoggerWarn(() => (
      manager.loadArea('example-bundle', 'example-area', { script: 'missing-area-script' })
    ));

    assert.strictEqual(warnCalls.length, 1, 'expected a single warning');
    assert.ok(warnCalls[0].includes('example-bundle'), 'expected bundle name in warning');
    assert.ok(warnCalls[0].includes('example-area'), 'expected area name in warning');

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
