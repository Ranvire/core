# Channels in the Core Engine

This document explains channel architecture in the core engine: what channels are, what behavior they guarantee, how they are loaded and used, and what extension/API interfaces are available to downstream games and bundles.

## At a glance

In core, a **Channel** is a communication primitive that combines:

1. **Identity** (`name`, optional `aliases`, `description`)
2. **Audience selection strategy** (`audience`, a `ChannelAudience` implementation)
3. **Message rendering** (`formatter.sender`, `formatter.target`, optional `color` helper)
4. **Dispatch semantics** (sender echo, target broadcast, post-send `channelReceive` event)

`ChannelManager` stores channels by name and alias, and `BundleManager` loads channel definitions from each bundle's `channels.js`.

---

## Core components

### `Channel`

`src/Channel.js` defines the primary runtime object.

#### Constructor contract

A channel must include:

- `config.name` (required)
- `config.audience` (required)

Optional fields:

- `description`
- `minRequiredRole`
- `bundle` (set by loader for traceability)
- `color` (single tag or tag stack)
- `aliases`
- `formatter` with `{ sender, target }`

Default formatter behavior (if omitted):

- `sender`: `[channelName] SenderName: message`
- `target`: same as sender formatter by default

### `ChannelAudience`

`src/ChannelAudience.js` defines a base strategy class.

Primary methods:

- `configure({ state, sender, message })`
- `getBroadcastTargets()`
- `alterMessage(message)`

Base defaults:

- targets: all connected players (`state.PlayerManager.getPlayersAsArray()`)
- message mutation: no-op

### `ChannelManager`

`src/ChannelManager.js` holds a map of registered channels.

Methods:

- `get(name)` exact lookup
- `add(channel)` registers `channel.name`, plus aliases if present
- `remove(channel)` removes by canonical channel name
- `find(search)` returns first channel whose registered name/alias starts with `search`

> Note: `remove(channel)` removes only `channel.name`; alias keys are not removed in the current implementation.

---

## Send lifecycle (`Channel#send`)

`Channel#send(state, sender, message)` executes the full pipeline:

1. Rejects empty message (`NoMessageError`).
2. Configures audience with context (`state`, `sender`, `message`).
3. Resolves targets using `audience.getBroadcastTargets()`.
4. Party-specific guard: if audience is `PartyAudience` and no targets, throws `NoPartyError`.
5. Applies `message = audience.alterMessage(message)`.
6. Sends sender echo:
   - private channels pass resolved target to sender formatter
   - non-private channels pass `null` target to sender formatter
7. Broadcasts to targets via `Broadcast.sayAtFormatted(...)` and target formatter.
8. Emits `channelReceive` on each target with color-stripped `rawMessage`.

### Channel-level errors

The channel module exports three specific error classes:

- `NoMessageError`
- `NoPartyError`
- `NoRecipientError`

Private-channel behavior (`PrivateAudience`) throws `NoRecipientError` when no target is resolved.

---

## Audience implementations (built in)

The audience class is the main routing affordance.

### `WorldAudience`

- Recipients: all players except sender.
- Use case: global chat.

### `PrivateAudience`

- Recipient parsing: first token in `message` is treated as target player name.
- Recipients: `[target]` or `[]`.
- Message mutation: strips target token from payload before broadcast.
- Use case: tell/whisper style channels.

### `PartyAudience`

- Recipients: sender party broadcast targets excluding sender.
- If sender has no party/targets, channel send path throws `NoPartyError`.

### `RoleAudience`

- Requires `minRole` in constructor options.
- Recipients: players where `player.role >= minRole`, excluding sender.
- Use case: staff/mod/admin channels.

### `RoomAudience`

- Recipients: sender room broadcast targets excluding sender.
- Use case: local speech channels.

### `AreaAudience`

- Recipients: area broadcast targets excluding sender.
- If sender has no room, returns empty array.
- Use case: area-wide announcements.

---

## Bundle and load-time integration

`BundleManager#loadBundle` includes `channels.js` in its feature loading order.

`BundleManager#loadChannels(bundle, channelsFile)`:

1. Requires the bundle's `channels.js` export.
2. Normalizes to array.
3. In strict mode, validates uniqueness of channel names and aliases via `_registerOrThrow(...)`.
4. Sets `channel.bundle = bundle`.
5. Registers in `state.ChannelManager`.

This means channels are intended to be **bundle-defined data + runtime objects**, not hardcoded centrally.

---

## TypeScript/public API surface

Core type declarations expose:

- `Channel` config and methods (`send`, `describeSelf`, `getUsage`, formatters)
- `ChannelAudience` interface-like base methods (`configure`, `getBroadcastTargets`, `alterMessage`)
- `ChannelManager` registry methods (`get`, `add`, `remove`, `find`)

`types/index.d.ts` exports `Channel`, `ChannelAudience`, and `ChannelManager` on the package namespace.

`GameState` includes `ChannelManager`, making channel lookup part of the canonical runtime state container.

---

## Interface/contract details worth knowing

### Formatter signatures

- Sender formatter:
  - `(sender, targetOrNull, message, colorify) => string`
- Target formatter:
  - `(sender, target, message, colorify) => string`

`colorify(message)` wraps output with configured color tags (single tag or nested tags).

### Usage metadata helpers

`describeSelf(sender)` prints:

- channel name
- channel syntax from `getUsage()`
- optional channel description

`getUsage()` convention:

- private audience: `<name> <target> [message]`
- other audiences: `<name> [message]`

### Event affordance for observers

Each recipient target receives:

- `target.emit('channelReceive', channel, sender, rawMessage)`

This provides a hook for player/NPC/entity systems to react to chat traffic while avoiding color-tag parsing burden in listeners.

---

## Important implementation nuances and caveats

1. **`minRequiredRole` is a channel property, not enforced in `Channel#send` itself.**
   - Enforcement is expected to happen in command/routing layers that decide whether a player may invoke a channel.
2. **Alias removal in `ChannelManager#remove` is partial.**
   - It deletes canonical `channel.name` but does not remove alias keys.
3. **`find(search)` returns first prefix match in map iteration order.**
   - Ambiguous prefixes depend on insertion order.
4. **Private target parsing is token-based and space-delimited.**
   - Target lookup uses first token exactly as entered.
5. **`channelReceive` only emits for resolved targets, not sender.**

These behaviors are useful to know for downstream command UX, moderation tools, logging, and plugin hooks.

---

## Typical downstream usage pattern

A bundle usually:

1. Exports one or more `Channel` instances from `channels.js`.
2. Chooses an audience class (or custom subclass of `ChannelAudience`).
3. Optionally customizes formatter, color, aliases, role metadata.
4. Relies on command handlers to:
   - resolve channel by name/alias,
   - enforce permission/role policy,
   - call `channel.send(state, player, message)`,
   - map channel-specific errors to player-friendly responses.

---

## Relevant source files

- Runtime:
  - `src/Channel.js`
  - `src/ChannelAudience.js`
  - `src/ChannelManager.js`
  - `src/WorldAudience.js`
  - `src/PrivateAudience.js`
  - `src/PartyAudience.js`
  - `src/RoleAudience.js`
  - `src/RoomAudience.js`
  - `src/AreaAudience.js`
  - `src/BundleManager.js` (`loadChannels` + feature list)
- Types:
  - `types/Channel.d.ts`
  - `types/ChannelAudience.d.ts`
  - `types/ChannelManager.d.ts`
  - `types/index.d.ts`
  - `types/GameState.d.ts`
- Tests:
  - `test/unit/BundleManagerStrictMode.js` (duplicate alias/name registration behavior in strict mode)
