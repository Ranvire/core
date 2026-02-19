# GameServer Lifecycle Readiness and Guardrails

Status: Proposed  
Owner: Core maintainers  
Last updated: 2026-02-19

## Purpose

Introduce explicit lifecycle readiness signaling and transition guardrails for `GameServer` so malformed orchestrator usage cannot silently start the runtime in an invalid state.

## Problem Statement

`GameServer.startup(commander)` currently emits `startup` directly with no lifecycle state checks. This means an embedding orchestrator can:

1. Call `startup` too early (before bundles and listener wiring are complete).
2. Call `startup` multiple times unintentionally.
3. Call `shutdown` from invalid states.

Current behavior is minimal and flexible, but too permissive for robust downstream boot flows.

## Goals

1. Add explicit lifecycle state tracking in `GameServer`.
2. Emit readiness milestones that downstream systems can rely on.
3. Reject invalid lifecycle transitions with clear errors.
4. Preserve backward compatibility for existing `startup` and `shutdown` listeners.

## Non-Goals

1. No orchestrator rewrite in this proposal.
2. No module export surface changes.
3. No ESM migration.
4. No changes to bundle content authoring format.

## Proposed Contract

### A. Lifecycle states

Track a finite state machine:

1. `created`
2. `booting`
3. `bundlesLoaded`
4. `eventsAttached`
5. `starting`
6. `ready`
7. `stopping`
8. `stopped`
9. `error`

### B. Lifecycle milestone events

Emit additional lifecycle events:

1. `bootStart`
2. `bundlesLoaded`
3. `serverEventsAttached`
4. `ready`
5. `shutdownStart`
6. `stopped`
7. `lifecycleError`

Compatibility events retained:

1. `startup(commander)` (existing)
2. `shutdown()` (existing)

### C. Guardrails and transition policy

1. `startup(commander)` is valid only from `eventsAttached` (and optionally idempotent from `ready`).
2. Calling `startup` from any earlier state throws a lifecycle error with current and expected state.
3. `shutdown()` is valid only from `ready` (or `starting` if early abort policy is accepted).
4. Invalid `shutdown` transitions throw similarly.
5. `status` property and `isReady()` helper are exposed for downstream checks.

### D. Backward compatibility

1. Existing listeners on `startup` and `shutdown` continue to fire.
2. Existing server event scripts do not need changes.
3. New milestone events are additive.

## Integration Notes (Orchestrator)

Expected boot flow in wrapper/orchestrator:

1. Construct game state and `GameServer`.
2. Emit `bootStart`.
3. `BundleManager.loadBundles()`.
4. Mark/emit `bundlesLoaded`.
5. `ServerEventManager.attach(GameServer)`.
6. Mark/emit `serverEventsAttached`.
7. Call `GameServer.startup(commander)`.
8. Mark/emit `ready`.

## Test Plan

New tests should cover:

1. Valid boot transition sequence.
2. Invalid `startup` before `eventsAttached` throws.
3. Duplicate `startup` behavior (throw or no-op by policy).
4. Valid shutdown sequence and state transitions.
5. Invalid `shutdown` before ready throws.
6. Existing `startup` and `shutdown` event listeners still fire.
7. New milestone events emit in deterministic order.

## Risks and Mitigations

1. Risk: Downstream wrappers relying on permissive behavior may break.
   Mitigation: Stage guards behind a temporary compatibility flag, defaulting to permissive for one release if needed.
2. Risk: Event name overlap confusion.
   Mitigation: Document lifecycle events and preserve existing names unchanged.
3. Risk: Partial bootstrap code paths (tests/tools) may not set states.
   Mitigation: Provide explicit methods for wrappers to set milestones cleanly.

## Implementation Checklist

- [ ] Add lifecycle state tracking fields to `src/GameServer.js`.
- [ ] Add state transition helper and standardized lifecycle error messages.
- [ ] Add additive milestone emit methods (or a dedicated transition API).
- [ ] Add `status` getter and `isReady()` helper.
- [ ] Keep existing `startup` and `shutdown` signatures unchanged.
- [ ] Add unit tests for valid/invalid transitions and event emission order.
- [ ] Add wrapper-level smoke test covering expected boot sequence.
- [ ] Document new lifecycle contract in `docs/NOTES.md`.
- [ ] Add `CHANGELOG.md` entry describing additive lifecycle events and guard behavior.

## Acceptance Criteria

1. `GameServer` rejects invalid transition calls with clear errors.
2. Readiness is observable via state and milestone events.
3. Existing `startup`/`shutdown` listeners remain functional.
4. Tests lock in order, state transitions, and compatibility behavior.
