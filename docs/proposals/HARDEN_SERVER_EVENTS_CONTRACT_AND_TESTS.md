# Harden Server-Events Contract and Tests

Status: Proposed  
Owner: Core maintainers  
Last updated: 2026-02-19

## Purpose

Define a concrete, test-backed contract for bundle `server-events` loading and lifecycle dispatch behavior in core, while preserving current compatibility constraints:

1. CommonJS stays default.
2. No export-surface changes.
3. No bundle layout redesign.

## Problem Statement

`loadServerEvents` currently loads and registers listeners but does not validate export shape with the same rigor as `loadInputEvents`. This leaves several failure modes surfacing late or unclearly:

1. Missing `listeners` object.
2. Non-function listener factory entries.
3. Factories that return non-function handlers.
4. Ambiguous duplicate-registration behavior across repeated load calls.

The engine also lacks dedicated contract tests for server lifecycle event wiring and dispatch.

## Goals

1. Make server-events loading deterministic and fail-fast with actionable errors.
2. Preserve valid legacy content script shapes.
3. Document and test attach/detach and lifecycle behavior that downstream repos depend on.
4. Keep behavior additive and reversible.

## Non-Goals

1. No ESM migration.
2. No entrypoint or exports-map changes.
3. No architectural rewrite of event dispatch.
4. No forced migration of downstream bundles.

## Current Behavior Summary

1. Bundle discovery includes `server-events/` as a feature path.
2. `loadServerEvents` reads `*.js` files in that directory.
3. Loader output is normalized via `_getLoader(loader, srcPath)` and `.listeners` is read.
4. Each listener factory is invoked with `state`; returned handler is added to `ServerEventManager`.
5. `GameServer.startup(commander)` emits `startup`; `GameServer.shutdown()` emits `shutdown`.
6. Event manager attachment to `GameServer` occurs in downstream bootstrap wiring, not in core.

## Proposed Hardened Contract

### A. Discovery and order

1. Discover server events only from `<bundle>/server-events/*.js`.
2. Filter remains script files ending in `js`.
3. Make file iteration deterministic by sorting filenames before load.
4. Keep bundle processing order as configured by `Config.get('bundles')`.

### B. Accepted export shapes

Accepted module exports:

1. Object form:
```js
module.exports = {
  listeners: {
    startup: state => function onStartup(commander) {},
    shutdown: state => function onShutdown() {},
  },
};
```
2. Legacy function loader:
```js
module.exports = srcPath => ({
  listeners: {
    startup: state => function onStartup(commander) {},
  },
});
```

### C. Validation rules

At load time:

1. `listeners` must exist and be an object.
2. Every `listeners[eventName]` must be a function factory.
3. Factory invocation with `state` must return a function handler.
4. Validation errors must include bundle name, file name, and event name (if applicable).

### D. Runtime binding semantics

1. `loadServerEvents` registers handlers into `ServerEventManager`.
2. `ServerEventManager.attach(GameServer)` binds handlers to the server emitter.
3. Listener `this` is the `GameServer` instance (from `EventManager.attach` bind semantics).
4. `startup` forwards the `commander` argument; `shutdown` has no payload.

### E. Duplicate behavior policy

1. Preserve additive behavior across bundles for the same event name.
2. Keep strict-mode duplicate-map checks unchanged for map registries unrelated to listener fanout.
3. Optional follow-up: guard repeated identical load passes in one process to prevent accidental duplicate attachment growth.

## Test Plan

## 1. BundleManager server-events loader tests

New file: `test/unit/BundleManagerServerEvents.js`

1. Loads valid object-form module and registers expected event keys.
2. Loads valid legacy loader-function module.
3. Throws on missing `listeners`.
4. Throws when `listeners` is not an object.
5. Throws when `listeners[eventName]` is not a function.
6. Throws when factory returns non-function.
7. Error messages include bundle/file/event context.
8. Sorted file order produces deterministic registration order.
9. Additive registration across bundles remains supported.
10. Repeated load behavior is explicitly covered (baseline or guarded behavior, whichever policy is adopted).

## 2. EventManager attach/detach contract tests

New file: `test/unit/EventManagerAttachDetach.js`

1. `attach` binds listener `this` to the emitter.
2. `attach` registers all known listeners.
3. Duplicate `attach` behavior is documented via test.
4. `detach` with string removes that event.
5. `detach` with iterable removes selected events.
6. `detach(null)` removes all manager-known events.
7. `detach` with non-iterable invalid input throws `TypeError`.
8. Test documents `removeAllListeners` blast-radius risk on shared emitters.

## 3. GameServer lifecycle tests

New file: `test/unit/GameServerLifecycle.js`

1. `startup` emits exactly once with commander payload.
2. `shutdown` emits exactly once.
3. Server-event listener path (`ServerEventManager.attach(GameServer)`) executes handlers for both events.
4. Bound listener context is the `GameServer` instance.

## Implementation Sequence

1. Add tests that capture current behavior and desired validation outcomes.
2. Harden `loadServerEvents` validation and error messages.
3. Add deterministic filename sorting in `loadServerEvents`.
4. Re-run full test suite with Node 22.
5. Update changelog if user-visible error messaging changes.

## Risks and Mitigations

1. Risk: Existing malformed bundles that previously failed unclearly will now fail explicitly.
   Mitigation: Actionable error messages with bundle/file/event context.
2. Risk: Sorting may change implicit load order assumptions.
   Mitigation: Deterministic ordering is preferable; document in proposal and tests.
3. Risk: Duplicate attach behavior confusion.
   Mitigation: Add explicit tests and notes; optional follow-up guard if needed.

## Acceptance Criteria

1. Invalid server-event exports fail at load with clear context-rich errors.
2. Valid legacy scripts remain compatible.
3. Lifecycle dispatch and listener binding semantics are covered by unit tests.
4. File-load ordering for server-events is deterministic.
