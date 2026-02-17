# First-Class Script Exports Proposal (Ergonomic Content Scripts)

Status: Proposed  
Owner: Core maintainers  
Last updated: 2026-02-17

## Purpose

Define an additive script authoring contract that lets bundle authors declare lifecycle handlers as first-class root exports, without requiring runtime property wiring inside `spawn`, while also reserving a path for future command-hook root exports.

This proposal addresses engine contract ergonomics, not just local bundle conventions.

## Decision Summary

1. Core should support first-class root event-handler script authoring.
2. Core should recognize a defined set of root event entry-point names for entity and player script surfaces as stable API.
3. Command-phase root hook names (`canDirect`, `planDirect`, `reactDirect`, etc.) are provisional and require separate command-architecture adoption planning before they are active engine behavior.

## Problem Statement

Current authored content scripts are loaded through nested `listeners` maps and listener factories. In practice, command-phase hooks are often attached by mutating `this` during `spawn`, for example:

- `this.canDirect = ...`
- `this.planDirect = ...`
- `this.reactDirect = ...`

This has two costs:

1. Readability and authoring friction for content-focused scripters.
2. Lifecycle fragility: `spawn` is not a universal attachment point for all hydration paths.

## Goals

1. Support flat, first-class script exports for common lifecycle/event entry points.
2. Preserve backward compatibility for existing `module.exports.listeners` scripts.
3. Define deterministic precedence and validation rules to avoid loader ambiguity.
4. Keep runtime behavior additive and reversible.

## Non-Goals

1. No removal of legacy `listeners` authoring.
2. No entrypoint/export-surface changes (`index.js`, `main`, exports map).
3. No forced migration of existing bundles.
4. No command architecture rewrite in this proposal.

## Compatibility Constraints

1. Existing valid scripts must continue to load and run unchanged.
2. New root export support must be additive.
3. CommonJS remains default.
4. Strict mode semantics outside this feature remain unchanged.

## Current Contract Summary

Today, script loading in core is normalized through `.listeners` in several paths:

- Entity scripts: `src/BundleManager.js:395`
- Player events: `src/BundleManager.js:240`
- Behaviors: `src/BundleManager.js:581`
- Server events: `src/BundleManager.js:684`

Entity script listeners are attached through factory registries and `EventManager.attach`:

- `src/EntityFactory.js:49`
- `src/EventManager.js:40`

## Proposed Authoring Contract

### A. Legacy form (supported, unchanged)

```js
module.exports = {
  listeners: {
    spawn: state => function onSpawn() {},
    playerEnter: state => function onPlayerEnter(player, fromRoom) {},
  },
};
```

### B. Root form (new)

```js
function spawn() {}
function playerEnter(player, fromRoom) {}
function canDirect(actor, verbId, context) {}
function planDirect(actor, verbId, context) {}
function reactDirect(actor, verbId, context) {}

module.exports = {
  spawn,
  playerEnter,
  canDirect,
  planDirect,
  reactDirect,
};
```

### C. Mixed form (supported)

`listeners` and root entry points may coexist under deterministic precedence rules defined below.

## Recognized Root Entry Points

### Stable entity script root events (room/item/npc/area scripts)

Lifecycle/event handlers are recognized by name for core-supported event entry points:

- `spawn`
- `ready`
- `updateTick`
- `playerEnter`
- `playerLeave`
- `npcEnter`
- `npcLeave`
- `enterRoom`
- `save`
- `saved`

### Stable player event root handlers (`player-events.js`)

Root event handlers follow the same event-name model as player event listeners (for example `updateTick`, `save`, `saved`, `enterRoom`).

### Provisional entity script root hooks (architecture-coupled)

Command-policy/planner/reaction hooks:

- `canDirect`
- `canIndirect`
- `planDirect`
- `planIndirect`
- `reactDirect`
- `reactIndirect`
- `captureChecks`

These names are proposed only. They are not yet active command behavior until command-architecture adoption work defines and ships invocation semantics.

## Validation and Conflict Rules

### Shape validation

Accepted value shapes for each recognized root key:

1. function (preferred)
2. legacy listener factory `(state) => function` for event handlers

### Unknown root keys

1. Function-valued exports outside recognized event/hook names are treated as helper exports and ignored by loader normalization.
2. Reserved-name shape violations (recognized name but invalid value) follow strict mode:
   1. `strictMode === true`: throw
   2. `strictMode === false`: warn and ignore

### Precedence rules

1. Recognized root entry points are normalized before lifecycle events run on the instance.
2. Runtime assignment inside script listeners remains legal and overrides previously attached root hook properties.
3. If both `listeners[eventName]` and root `eventName` are present, core attaches both listeners in deterministic order:
   1. legacy `listeners[eventName]`
   2. root `eventName`

## Loader Normalization Model

Introduce a shared script normalization path used by `BundleManager` loaders.

### Normalized shape

```js
{
  listeners: { [eventName]: ListenerFactoryOrFunction },
  hooks: { [hookName]: Function },
}
```

### Application rules

1. `listeners` are registered through existing event attachment paths.
2. `hooks` are extracted and attached only for recognized hook names.
3. Existing event manager semantics remain unchanged for listener dispatch.

## Architecture Coupling (Command Hooks)

1. Root command hook names are architecture-coupled to the phase dispatcher model (capture/plan/bubble/commit/render).
2. Until that dispatcher contract is adopted in core, extracted root command hooks are inert metadata and must not be treated as guaranteed runtime behavior.
3. When/if core adopts the command architecture:
   1. `canDirect`/`canIndirect` execute in Capture.
   2. `planDirect`/`planIndirect` execute in Plan contribution.
   3. `reactDirect`/`reactIndirect` execute in Bubble.
4. Legacy command paths remain unchanged unless explicitly routed through the new dispatcher.

## Why This Does Not Create Chaos

1. The recognized root surface is explicit and finite.
2. Legacy scripts remain valid and untouched.
3. Unknown helper exports are ignored; reserved-name shape errors are caught by strict mode and visible in non-strict logs.
4. Runtime overrides still work for edge cases, preserving current flexibility.

## Implementation Plan

### Phase 1: Normalization utility

Add shared utility (for example `src/ScriptExportNormalizer.js`) that:

1. Reads legacy `listeners`.
2. Extracts recognized root event handlers.
3. Extracts recognized root hooks as provisional metadata only.
4. Validates and returns normalized shape.

### Phase 2: BundleManager integration

Use normalizer in:

1. `loadEntityScript` (`src/BundleManager.js`)
2. `loadPlayerEvents` (`src/BundleManager.js`)
3. optional follow-up: behavior/server event loaders for consistency

### Phase 3: Entity hook materialization

Add attach-time hook materialization for event ergonomics. Command-hook materialization remains provisional pending architecture adoption.

### Phase 4: Docs and examples

Document root script contract and migration examples in maintainer-facing docs.

### Phase 5: Command architecture follow-up (separate proposal/plan)

Define command dispatcher ownership, invocation order, and rollback-safe semantics for provisional hook names before enabling them as active runtime behavior.

## Test Plan

Add focused unit tests covering:

1. Legacy `listeners` scripts still behave exactly as before.
2. Root event handlers are registered and fired.
3. Mixed form precedence is deterministic.
4. Unknown function-valued helper exports are ignored.
5. Reserved-name shape violations:
   1. throw in strict mode
   2. warn+ignore in non-strict mode
6. Provisional command hooks are parsed but not invoked by legacy command flow.

## API Stability Statement

Once merged and documented:

1. Recognized root event entry-point names in this proposal are public API for bundle authors and should be treated as stable.
2. Provisional command-hook names are reserved but not yet stable behavioral API until command-architecture adoption is completed and documented.
3. Behavior/extensions outside the recognized key set are not part of this contract.

## Example Migration (Rope Script)

From:

- attach `pullSuccessMessage` / `planDirect` via `spawn`

To:

- export lifecycle handlers directly at module root
- keep `spawn` only for true spawn-time behavior
- treat root command hooks as provisional until command-architecture enablement lands

This reduces coupling between lifecycle timing and command hook availability.
