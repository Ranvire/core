const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const BundleManager = require('../../src/BundleManager');
const Logger = require('../../src/Logger');

describe('BundleManager', () => {
  describe('loadQuests', () => {
    it('surfaces loader errors from fetchAll', async () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-manager-'));
      const loader = {
        setBundle: () => {},
        setArea: () => {},
        fetchAll: async () => {
          throw new Error('boom');
        }
      };
      const state = {
        EntityLoaderRegistry: {
          get: () => loader
        },
        QuestFactory: {
          add: () => {
            throw new Error('QuestFactory.add should not be called');
          },
          makeQuestKey: () => 'unused'
        }
      };

      await withStubbedLoggerError(async errorCalls => {
        const manager = new BundleManager(tempDir, state);

        await assert.rejects(
          () => manager.loadQuests('example-bundle', 'example-area'),
          error => {
            assert.strictEqual(
              error.message,
              'Error loading quests [example-bundle:example-area]'
            );
            assert.ok(error.cause);
            assert.strictEqual(error.cause.message, 'boom');
            return true;
          }
        );
        assert.strictEqual(errorCalls.length, 1);
      });

      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('adds actionable guidance when quests.yml is missing', async () => {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-manager-'));
      const missingPath = path.join(
        tempDir,
        'example-bundle',
        'areas',
        'example-area',
        'quests.yml'
      );
      const missingErr = new Error(`ENOENT: no such file or directory, open '${missingPath}'`);
      missingErr.code = 'ENOENT';
      missingErr.path = missingPath;

      const loader = {
        setBundle: () => {},
        setArea: () => {},
        fetchAll: async () => {
          throw missingErr;
        }
      };
      const state = {
        EntityLoaderRegistry: {
          get: () => loader
        },
        QuestFactory: {
          add: () => {
            throw new Error('QuestFactory.add should not be called');
          },
          makeQuestKey: () => 'unused'
        }
      };

      await withStubbedLoggerError(async errorCalls => {
        const manager = new BundleManager(tempDir, state);

        await assert.rejects(
          () => manager.loadQuests('example-bundle', 'example-area'),
          error => {
            assert.match(
              error.message,
              /quests\.yml is required for each area/
            );
            assert.match(
              error.message,
              /For areas with no quests, create quests\.yml containing \[\]/
            );
            assert.match(
              error.message,
              /example-bundle\/areas\/example-area\/quests\.yml/
            );
            assert.strictEqual(error.cause, missingErr);
            return true;
          }
        );

        assert.strictEqual(errorCalls.length, 1);
        assert.match(
          String(errorCalls[0][0]),
          /quests\.yml is required for each area/
        );
      });

      fs.rmSync(tempDir, { recursive: true, force: true });
    });
  });
});

async function withStubbedLoggerError(run) {
  const errorCalls = [];
  const originalError = Logger.error;
  Logger.error = (...args) => errorCalls.push(args);

  try {
    await run(errorCalls);
  } finally {
    Logger.error = originalError;
  }
}
