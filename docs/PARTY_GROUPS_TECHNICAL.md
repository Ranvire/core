# Party / Player Group System: Technical Reference

## Scope and intent

This document captures the current **engine-level** behavior for player groups ("parties") in `rantamuta-core`, including:

- what the core party model does today,
- what membership means at runtime,
- how parties are created/joined/left/disbanded at the API level,
- how party-aware channels work,
- what is intentionally **not** implemented in core,
- command-layer responsibilities for game/bundle maintainers.

This is a technical reference for maintainers and bundle authors, not a player-facing guide.

---

## Source map (where party behavior lives)

- `src/Party.js` – party data model and membership/invite operations.
- `src/PartyManager.js` – active party registry and create/disband lifecycle.
- `src/Character.js` – per-character `party` association field.
- `src/PartyAudience.js` – channel audience scoped to party members.
- `src/Channel.js` – channel send flow and `NoPartyError` behavior for party audience.

Related context:

- `docs/proposals/AREA_SHARDS_ENGINE_LEVEL_FEATURE.md` notes that parties currently have no stable `party.id` and proposes one for shard keying.

---

## Data model and runtime semantics

### `Party` is a `Set` of members

`Party` extends `Set` and stores:

- `leader` – the designated party leader.
- `invited` – `Set` of invited characters.

Constructor behavior:

1. initialize `invited` as empty `Set`,
2. set `leader`,
3. auto-add the leader as a member via `add(leader)`.

### Character membership state

Each `Character` has:

- `party: Party | null`

A character is "in a party" iff `character.party !== null`.

### Membership mutations are stateful and side-effecting

`Party.add(member)`:

- adds to `Set`,
- assigns `member.party = this`,
- clears any existing invite for that member (`invited.delete(member)`).

`Party.delete(member)`:

- removes from `Set`,
- assigns `member.party = null`.

`Party.disband()`:

- iterates all current members,
- calls `delete(member)` for each,
- resulting in every member's `party` pointer reset to `null`.

---

## Lifecycle APIs

### Create a party

API:

- `PartyManager.create(leader)`

Behavior:

- constructs `new Party(leader)`,
- registers the party in the manager (`this.add(party)`).

Important note:

- `create` currently does **not** return the newly created party object.

### Disband a party

API:

- `PartyManager.disband(party)`

Behavior:

1. remove party from manager set,
2. call `party.disband()` to clear membership references,
3. local variable set to `null` (no runtime effect outside function scope).

---

## Invite semantics

`Party` provides invite primitives:

- `invite(target)` – add target to invite set.
- `isInvited(target)` – check invite set membership.
- `removeInvite(target)` – revoke invite.

### Critical policy detail

`Party.add(member)` does **not** validate invites.

That means invitation enforcement is a **command/policy-layer concern**. If you require "must be invited to join," implement that check in commands/services before calling `party.add`.

---

## Channel integration (party chat / group audience)

### Party-scoped audience

`PartyAudience.getBroadcastTargets()`:

- if `sender.party` is null ⇒ return `[]`,
- else return all party members except sender.

So party audience is explicitly "other party members," not "all including sender."

### Channel send flow interaction

`Channel.send(...)` has a guard:

- if audience is `PartyAudience` and there are no targets, throw `NoPartyError`.

Implications:

- If sender has no party, party channel usage errors.
- If sender is the only member in party, targets are still empty (self excluded), so it also errors.

Sender formatting/output still happens in channel flow for non-error cases, but party audience delivery only targets other members.

---

## What party membership currently means (and does not mean)

### Means

At engine core level, party membership means:

- a runtime association (`character.party`) and
- inclusion in a party member set.

This enables party-targeted audience selection (e.g., channel delivery to party peers).

### Does not automatically mean

The core party model does **not** implement, by itself:

- XP sharing/splitting,
- loot distribution,
- combat assist behavior,
- synchronized movement/follow formations,
- party HUD/status summaries,
- role/permission enforcement (leader-only invite/kick/etc.),
- persistence guarantees across reboot (outside whatever higher layers do).

These are bundle/game responsibilities.

---

## Interface implications: commands are expected above core

There is no single built-in core command interface contract for party UX in this repository. Typical gameplay commands should be implemented in command bundles and mapped to core primitives.

A conventional command surface might include:

- `party create`
- `party invite <player>`
- `party accept <leader|party>` / `party decline ...`
- `party leave`
- `party kick <player>`
- `party disband`
- `party leader <player>`
- `party list` / `party who`
- party chat command/alias backed by `PartyAudience`

### Suggested command-layer invariants

To avoid ambiguous behavior, commands should enforce:

1. one-party-at-a-time membership,
2. invite requirement before accept/join,
3. leader authorization for restricted actions,
4. leader handoff policy when leader leaves,
5. deterministic disband policy when member count drops below threshold,
6. clear handling for "party channel with no recipients" UX.

---

## Edge cases and implementation notes

1. **Leader field is informational unless enforced elsewhere**  
   `Party` stores `leader`, but methods themselves do not gate actions by leader.

2. **Invite cleanup on successful add**  
   `add(member)` automatically removes member from `invited`.

3. **Single-member chat edge case**  
   Party audience excludes sender; one-member party yields no targets and triggers `NoPartyError` in `Channel.send`.

4. **No stable party identity in current core**  
   Proposal documentation notes need for runtime `party.id` for sharding use cases.

5. **`PartyManager.create` return value**  
   Method currently returns `void`; caller patterns should account for this.

---

## Testing recommendations for downstream bundles

Before introducing feature-rich party behavior, add deterministic tests that lock current semantics and desired policy:

- creation assigns leader and membership pointer,
- add/delete maintain reciprocal state (`Set` membership and `character.party`),
- invite lifecycle (invite, accept/add, revoke),
- leave/disband membership cleanup,
- party channel delivery excludes sender and targets only party peers,
- party channel no-target behavior surfaces expected UX.

This aligns with the repository's general maintainership guidance to codify behavior with tests before risky behavioral changes.

---

## Future-facing notes

If party identity is needed for shard affinity or cross-system correlation, a minimal compatible extension is to add an opaque runtime `party.id` on creation (as discussed in area-sharding proposal docs). Keep this internal and avoid coupling player-visible gameplay semantics to internal IDs.
