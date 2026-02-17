# Changelog

All entries follow `docs/CHANGELOG_POLICY.md`.

## Unreleased

### Player missing-room hydrate recovery

- Summary:
  - Updated `Player#hydrate` to repair players saved with missing/null `room` by moving them to the placeholder room.
  - Added explicit error logging when a player is saved without a room.
- Why:
  - Missing/null room data left players in an invalid "nowhere" state and could lead to save failures with unclear diagnostics.
- Impact:
  - Players with missing/null `room` values are now recovered during hydrate instead of remaining roomless.
  - Operators now receive an explicit error log for this data corruption case.
- Migration/Action:
  - None.
- References:
  - Issue: #31
  - Tests: `test/unit/PlayerHydrateRoom.js` (`Player hydrate room recovery` coverage)
- Timestamp: 2026.02.17 17:15

### EffectFactory.get recursion fix

- Summary:
  - Fixed `EffectFactory#get` so it returns the registered effect definition (or `null`) instead of recursively calling itself.
- Why:
  - The prior implementation caused infinite recursion and `RangeError: Maximum call stack size exceeded` on any `get` call.
- Impact:
  - Consumers calling `EffectFactory#get` now receive deterministic lookup behavior instead of a runtime stack overflow.
  - No entrypoint or export-surface changes.
- Migration/Action:
  - None.
- References:
  - Issue: #49
  - Test: `test/unit/EffectFactory.js` (`#get` regression coverage)
- Timestamp: 2026.02.17 12:54

### EffectFactory.create override isolation fix

- Summary:
  - Fixed `EffectFactory#create` to clone default `config` and `state` before applying per-instance overrides.
- Why:
  - The previous merge logic mutated shared definition objects, causing one instance's overrides to leak into subsequent instances.
- Impact:
  - Per-instance overrides no longer affect future instances.
  - Existing APIs remain unchanged.
- Migration/Action:
  - None.
- References:
  - Issue: #51
  - Tests: `test/unit/EffectFactory.js` (`#create` regression coverage for config/state leakage)
- Timestamp: 2026.02.17 12:54

### EffectList paused-damage gating fix

- Summary:
  - Fixed `EffectList` damage evaluation paths to skip paused effects for incoming and outgoing damage modifier application.
- Why:
  - Paused effects were correctly skipped in other paths, but damage evaluation still applied paused modifiers.
- Impact:
  - Paused effects no longer alter incoming or outgoing damage while paused.
  - Behavior for active, unpaused effects is unchanged.
- Migration/Action:
  - None.
- References:
  - Issue: #55
  - Tests: `test/unit/EffectList.js` (`paused effects` regression coverage)
- Timestamp: 2026.02.17 13:13

### Effect pause sentinel zero fix

- Summary:
  - Changed effect pause sentinel handling to use `null` instead of truthy/falsy checks, and updated pause gates to explicit null checks.
- Why:
  - Pausing an effect immediately after activation can produce elapsed `0`; truthy pause checks treated that as unpaused and allowed modifiers/events to continue.
- Impact:
  - Effects paused at elapsed `0` are now reliably treated as paused.
  - `Effect.elapsed` now correctly remains `0` while such effects are paused.
- Migration/Action:
  - None.
- References:
  - Issue: #57
  - Tests: `test/unit/EffectList.js` (`paused immediately at elapsed zero` regression coverage)
- Timestamp: 2026.02.17 13:31

### EffectRemoved event payload fix

- Summary:
  - Updated `EffectList.remove` to emit the removed effect instance as payload on `Character#effectRemoved`.
- Why:
  - Listeners previously received no effect argument, making it impossible to identify which effect was removed from the event alone.
- Impact:
  - `effectRemoved` listeners now receive the removed `Effect` instance (`(effect)`), enabling deterministic downstream handling.
  - Event name and removal flow remain unchanged.
- Migration/Action:
  - If downstream listeners ignored arguments, no action is required.
  - If downstream code depended on missing payload, update handlers to accept/use the effect argument.
- References:
  - Issue: #58
  - Tests: `test/unit/EffectList.js` (`effectRemoved payload` regression coverage)
- Timestamp: 2026.02.17 13:42

### Room door state normalization

- Summary:
  - Normalized room door runtime state so `locked` and `closed` are canonical booleans with defaults of `false` when omitted in area data.
  - Updated `Room.isDoorLocked` to always return `boolean`.
  - Tightened `types/Room.d.ts` to match runtime (`RoomDoor.locked: boolean`, `RoomDoor.closed: boolean`, `isDoorLocked(): boolean`).
- Why:
  - Door config previously allowed tri-state lock behavior (`true | false | undefined`) when `locked`/`closed` keys were missing, creating ambiguous data-dependent behavior.
- Impact:
  - Missing `locked`/`closed` in room door definitions now behaves as `false` at runtime.
  - Downstream door-lock checks are now deterministic and type-safe.
  - Extra door metadata keys are preserved.
- Migration/Action:
  - If downstream code relied on `undefined` from `isDoorLocked`, update logic to use boolean semantics.
  - Existing door data does not require changes.
- References:
  - Issue: #42
  - Tests: `test/unit/RoomDoors.js` (`Room door state normalization` coverage)
- Timestamp: 2026.02.17 14:03

### AreaFloor signed-coordinate map storage

- Summary:
  - Replaced `AreaFloor` array-backed coordinate storage with nested `Map<number, Map<number, Room>>` storage.
  - Preserved `addRoom/getRoom/removeRoom` behavior and low/high bound tracking.
- Why:
  - Array/object-key behavior for signed coordinates was implementation-fragile and semantically ambiguous for sparse/negative indices.
- Impact:
  - Signed coordinate lookups are now backed by explicit map semantics instead of array property behavior.
  - Public runtime behavior of room add/get/remove remains consistent.
- Migration/Action:
  - None.
- References:
  - Issue: #44
  - Tests: `test/unit/AreaFloor.js` (`uses Map-backed coordinate storage`, signed coordinate coverage)
- Timestamp: 2026.02.17 14:18

### EntityFactory clone/create contract guardrails

- Summary:
  - Added explicit runtime contract checks in `EntityFactory.clone(entity)` before dispatching to subclass `create(...)`.
  - `clone()` now throws clear `TypeError` messages when subclass `create()` is not implemented or when `entity.entityReference` is missing.
  - Documented clone/create contract expectations in `types/EntityFactory.d.ts`.
- Why:
  - Base clone behavior relied on an implicit `(area, entityRef)` create signature and failed with ambiguous runtime errors when subclasses did not follow the contract.
- Impact:
  - Consumers extending `EntityFactory` now get immediate, explicit contract errors instead of indirect failures.
  - Existing concrete factories with compliant signatures continue to behave the same.
  - `AreaFactory.clone()` override behavior remains unchanged.
- Migration/Action:
  - Custom subclasses relying on base `clone()` must implement `create(area, entityRef)` or override `clone()`.
- References:
  - Issue: #43
  - Tests: `test/unit/EntityFactory.js` (`clone/create contract` coverage)
- Timestamp: 2026.02.17 14:28

### Character attributeUpdate payload contract alignment

- Summary:
  - Aligned `Character#attributeUpdate` runtime payload with documented contract by emitting a third snapshot argument while preserving the existing second numeric argument.
  - Updated Character docs/types to describe the exact event signature.
- Why:
  - The documented event contract did not match implementation, which emitted only `(attributeName, current)` and omitted attribute-structure context for listeners.
- Impact:
  - Event listeners now receive `('attributeUpdate', attributeName, current, snapshot)` where `snapshot` includes `{ name, base, max, current, delta }`.
  - Existing listeners using the second argument remain compatible.
- Migration/Action:
  - Optional: listeners that need richer context can consume the new third `snapshot` argument.
  - No action required for listeners that only use `attributeName`/`current`.
- References:
  - Issue: #67
  - Tests: `test/unit/CharacterAttributeUpdate.js` (all four attribute mutation paths)
- Timestamp: 2026.02.17 15:53

### AttributeFactory missing dependency fail-fast validation

- Summary:
  - Extended `AttributeFactory.validateAttributes()` to fail at startup when formulas require undefined attributes.
  - Added aggregated missing-dependency reporting in a single error message.
- Why:
  - Validation previously checked only circular references, allowing invalid formula dependency graphs to boot and fail later at runtime.
- Impact:
  - Invalid attribute schemas with missing formula dependencies now fail fast during validation.
  - Circular dependency detection behavior remains intact.
- Migration/Action:
  - Ensure all `formula.requires` entries reference defined attributes before startup validation.
- References:
  - Issue: #68
  - Tests: `test/unit/AttributeFactory.js` (`validateAttributes` missing-dependency and cycle coverage)
- Timestamp: 2026.02.17 16:16

### AttributeFactory metadata isolation on create

- Summary:
  - Updated `AttributeFactory.create()` to clone definition metadata per created `Attribute` instance.
- Why:
  - Runtime attributes previously shared the same metadata object reference, causing instance-to-instance and instance-to-definition mutation leakage.
- Impact:
  - Mutating `attribute.metadata` at runtime no longer affects other created instances.
  - Runtime metadata mutation no longer mutates stored factory definition metadata.
- Migration/Action:
  - None.
- References:
  - Issue: #66
  - Tests: `test/unit/AttributeFactory.js` (`#create metadata` coverage)
- Timestamp: 2026.02.17 16:22

### Attribute constructor delta invariant enforcement

- Summary:
  - Updated `Attribute` constructor to enforce the runtime delta invariant (`delta <= 0`) at construction time.
- Why:
  - Constructor previously accepted positive deltas, allowing current attribute values to exceed max via direct construction/hydration paths.
- Impact:
  - Positive constructor `delta` inputs are now normalized to `0`.
  - Negative deltas remain unchanged.
  - Constructor behavior now matches existing mutator invariant semantics.
- Migration/Action:
  - None.
- References:
  - Issue: #65
  - Tests: `test/unit/Attribute.js` (`#constructor` delta invariant coverage)
- Timestamp: 2026.02.17 16:27

### Attribute constructor strict numeric validation

- Summary:
  - Replaced permissive `isNaN` constructor validation in `Attribute` with strict finite-number checks for `base` and `delta`.
- Why:
  - Numeric strings and non-finite values were previously accepted due to coercive `isNaN` behavior, weakening type safety and relying on implicit arithmetic coercion.
- Impact:
  - Constructor now rejects numeric strings (for example `'10'`, `'2'`), `NaN`, and `Infinity` for `base`/`delta`.
  - Finite numeric inputs continue to work as before.
- Migration/Action:
  - Ensure call sites pass real finite numbers to `new Attribute(name, base, delta, ...)`.
- References:
  - Issue: #64
  - Tests: `test/unit/Attribute.js` (`#constructor` strict validation coverage)
- Timestamp: 2026.02.17 16:32

### AttributeFactory.create explicit zero-base override fix

- Summary:
  - Fixed `AttributeFactory.create()` to respect explicit `base = 0` overrides instead of falling back to definition defaults.
- Why:
  - `create()` previously used `base || def.base`, which treated `0` as missing and produced incorrect base values.
- Impact:
  - `create(name, 0)` now correctly produces attributes with base `0`.
  - `null`/`undefined` base inputs still fall back to the definition base.
- Migration/Action:
  - None.
- References:
  - Issue: #63
  - Tests: `test/unit/AttributeFactory.js` (`#create base override` coverage)
- Timestamp: 2026.02.17 16:40

### CommandManager alias cleanup on remove

- Summary:
  - Fixed `CommandManager.remove(command)` to remove alias keys registered for the command, not just `command.name`.
  - Added safe guards so keys are removed only if they still resolve to the same command instance.
- Why:
  - Removing only the canonical command name left stale aliases registered and still resolvable.
- Impact:
  - Removed commands no longer remain reachable through stale aliases.
  - Alias keys reassigned to another command are preserved.
- Migration/Action:
  - None.
- References:
  - Issue: #39
  - Tests: `test/unit/CommandManager.js` (`remove` alias cleanup coverage)
- Timestamp: 2026.02.17 16:44

### BundleManager no-bundles startup warning

- Summary:
  - Added an explicit startup warning when bundle loading completes with zero bundles loaded.
- Why:
  - Startup could appear to hang or proceed silently when no bundles were configured/loadable, making root cause discovery slow.
- Impact:
  - On no-bundles startup, logs now include a warning with configured bundle list and bundle path.
  - Startup behavior is otherwise unchanged (warning-only; no forced throw).
- Migration/Action:
  - If warning appears, verify `Config.bundles` and bundle directory contents/path.
- References:
  - Issue: #34
  - Tests: `test/unit/BundleManagerWarnings.js` (`warns when no bundles are configured or loadable during startup`)
- Timestamp: 2026.02.17 17:04

### Strict mode duplicate registration enforcement

- Summary:
  - Added configurable strict mode (`strictMode`, default `false`) so bundle loading fails fast when a later bundle attempts to register an already-registered key in map-based registries.
- Why:
  - Makes override collisions explicit and actionable during startup instead of silently overriding (or silently ignoring, depending on registry), matching the v1.1 strict mode contract.
- Impact:
  - With `strictMode: true`, startup now throws on duplicate bundle registrations and the error identifies the registry, duplicated key, and conflicting bundles.
  - With `strictMode: false`, existing behavior is preserved (override semantics and effect duplicate-ignore behavior remain unchanged).
- Migration/Action:
  - Optional: set `strictMode: true` in `ranvier.json` or `ranvier.conf.js` to enforce duplicate rejection.
  - If enabling strict mode on existing games, resolve bundle key collisions surfaced during startup.
- References:
  - PR: feat: implement v1.1 strict mode duplicate protection
  - Commits: 5eae842, 36d87e5
- Timestamp: 2026.02.11 00:10
### Type declaration surface expansion

- Summary:
  - Replaced opaque `types/index.d.ts` re-export typing (`typeof import("../src/X")`) with expanded, human-readable declarations across `types/*.d.ts`.
  - Added explicit CommonJS consumer regression checks via `tsconfig.types.json`, `types/validate.ts`, and `test/types/cjs-consumer.ts`.
- Why:
  - Improve downstream IntelliSense and static analysis quality, and document actual runtime API contracts in stable declarations instead of implementation-path imports.
- Impact:
  - TypeScript/JSDoc consumers now get concrete symbol/member types, stronger checking, and better editor navigation.
  - Runtime JavaScript behavior and module export strategy are unchanged.
- Migration/Action:
  - Optional but recommended: run `npm run typecheck` in downstream consumers to validate integration against the expanded declaration surface.
- References:
  - PR: #41 _Upgrade types_
  - Commit: `5a7318e`
  - Commit series: `types: tighten unknowns in <File>.d.ts`
- Timestamp: 2026.02.13 12:57

### Bundle load order respects config

- Summary:
  - `BundleManager.loadBundles` now loads bundles in the order listed by `Config.get('bundles')` and warns when a configured bundle is missing or not a directory.
- Why:
  - Ensures bundle loading is deterministic and matches explicit configuration.
- Impact:
  - Bundle load order follows config order instead of filesystem order.
  - Missing or invalid bundle paths now emit warnings.
- Migration/Action:
  - Ensure configured bundle names map to on-disk bundle directories and are ordered intentionally.
- References:
  - PR: #35 Load bundles in config order
- Timestamp: 2026.02.10 18:00

## Rantamuta v1.0.0 — Salpausselkä

**The Salpausselkä Release**

Salpausselkä refers to a series of prominent glacial ridges found only in Finland, formed at the end of the last Ice Age. They mark a stable boundary where movement slowed, pressure settled, and the landscape took on its lasting shape.

This release serves a similar role for Rantamuta: a stable baseline where behavior is preserved, modernization is complete, and future evolution can proceed on solid ground.

This release is the initial stable release of the Rantamuta core engine.

Rantamuta `v1.0.0` is based on the RanvierMUD engine at version `3.0.6` and is intended to preserve equivalent runtime behavior at the point of the fork, with modernization changes only.

Future releases may diverge in behavior as the Rantamuta project evolves.

### BundleManager hard-exit removal

- Summary:
  - Removed `process.exit(0)` calls from `BundleManager` error paths and replaced them with thrown errors that surface to the caller.
- Why:
  - `process.exit(0)` incorrectly signaled successful startup on bundle or area hydration failures and made the core engine unsafe to consume as a library. `0` incorrectly signals _no error_ and the consumer, not the dependency library, properly determines exit.
- Impact:
  - Bundle and area load failures now cause bundle loading to fail via a thrown error instead of terminating the process directly.
  - Downstream wrappers are responsible for handling the error and setting an appropriate exit code.
- Migration/Action:
  - Wrappers invoking `BundleManager.loadBundles` should ensure failures are caught and result in a non-zero process exit.
  - No action is required for callers that already allow startup failures to crash the process.
- References:
  - PR: #29 Replace `process.exit(0)` in `BundleManager` with thrown errors
- Timestamp: 2026.02.10 16:20

### Bundle warning context

- Summary:
  - Bundle/area/entity context was added to warnings for missing scripts and invalid entity data.
- Why:
  - Improves diagnostics when bundles are misconfigured or scripts are missing.
- Impact:
  - No control flow change; only log message text is more specific.
- Migration/Action:
  - None.
- References:
  - PR: #28 Add bundle/area/entity context to warnings
- Timestamp: 2026.02.09 15:18

### Input event validation errors

- Summary:
  - `BundleManager.loadInputEvents` now includes the invalid export type in its error message when `event` is not a function.
- Why:
  - Improves diagnostics by making it clear what the loader actually received.
- Impact:
  - Only the error string changes; invalid input events still throw.
- Migration/Action:
  - None.
- References:
  - PR: #27 Validate `loadInputEvents` with clearer errors
- Timestamp: 2026.02.09 14:56

### CI audit reporting

- Summary:
  - CI now runs a non-blocking `npm audit` and uploads the JSON report as a workflow artifact.
- Why:
  - Provide visibility into dependency vulnerabilities without failing the build.
- Impact:
  - No runtime impact; CI now publishes an audit report artifact for each run.
- Migration/Action:
  - None.
- References:
  - PR: #26  Add non-blocking CI dependency audit artifact
- Timestamp: 2026.02.09 14:43

### Logger pretty errors warning

- Summary:
  - `Logger.enablePrettyErrors` now warns once that long async stacks are no longer enabled and points to `docs/DEBUGGING_DIAGNOSTICS.md`.
- Why:
  - `longjohn` is being divested due to compatibility and performance risk, while preserving API compatibility.
- Impact:
  - Callers will see a one-time warning; pretty-error formatting still runs without long async stack instrumentation.
- Migration/Action:
  - Use the documented Node diagnostics flags and Inspector workflow for debugging.
- References:
  - PR: #25 "Remove `longjohn`"
- Timestamp: 2026.02.09 14:29

### Quest loader error surfacing

- Summary:
  - `BundleManager.loadQuests` now surfaces loader failures instead of returning a silent empty list.
- Why:
  - Avoids masking quest data errors during bundle loading so failures are actionable.
- Impact:
  - Bundle load will fail fast if quest loaders throw; downstream loaders must handle or fix invalid quest data.
- Migration/Action:
  - Ensure quest loader data is valid; handle thrown errors where bundle loading is invoked if needed.
- References:
  - PR: Surface quest loader failures from BundleManager.loadQuests #21
- Timestamp: 2026.02.09 07:38

### Data file error context

- Summary:
  - Added action-specific error messages for `Data.parseFile` and `Data.saveFile` that include full file paths.
- Why:
  - Improves diagnostics for missing files or unsupported extensions during data load/save operations.
- Impact:
  - Users will see clearer error messages that distinguish parse vs. save failures.
- Migration/Action:
  - None.
- References:
  - Commit: 19fe39e
- Timestamp: 2026.02.10 12:00

### Config pre-load guard

- Summary:
  - Added an explicit pre-load guard for `Config.get` with a dedicated error type.
- Why:
  - Prevent ambiguous null access errors and make config lifecycle violations explicit.
- Impact:
  - Callers invoking `Config.get` before `Config.load` now receive a clear error instead of a generic runtime failure.
- Migration/Action:
  - Ensure `Config.load` is called before any `Config.get` usage.
- References:
  - Commit: 8e298cc
- Timestamp: 2026.02.09 09:30

### Remove `sty` dependency

- Summary:
  - Replaced RanvierMUD's `sty` dependency with a homegrown color tag parser.
- Why:
  - `sty` is no longer supported and has long-standing, critical security issues. DIY parser `Ansi.js` added to reduce dependency surface and align color parsing with engine-specific needs.
- Impact:
  - Downstream code that relied on `sty` behaviors should use the core color tag parser instead.
- Migration/Action:
  - Update downstream logging or formatting to use the core color tag format where applicable.
- Timestamp: 2026.02.08 17:30
