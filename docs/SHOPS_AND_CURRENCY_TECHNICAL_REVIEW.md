# Shops and Currency in the Core Engine: Technical Review

## Scope and intent

This document reviews how the **core engine** represents the systems needed for shops and currency, from an implementation and API perspective (not gameplay design).

It covers:

- Which classes and managers are involved
- Which APIs are available for implementing buy/sell/exchange
- How commands, behaviors, metadata, and attributes compose into shop functionality
- Current constraints/gaps in core

---

## Executive summary

There is currently **no first-class shop subsystem** in core:

- No `Shop` class
- No dedicated `Currency` class
- No built-in transaction service for buying/selling/barter

Instead, the engine exposes extensibility primitives, and shop systems are composed at bundle level using:

1. **Commands** (`commands/`) for player entrypoints such as `buy`, `sell`, `list`, `value`
2. **NPC/item/room behaviors** (`behaviors/`) for merchant rules and reactive logic
3. **Entity metadata and/or attributes** for balances and pricing data
4. **Inventory transfer APIs** for item movement

This is consistent with the loader architecture in `BundleManager`, which has loaders for commands/behaviors/attributes/etc., but no dedicated commerce loader category.

---

## Core architecture touchpoints

### Bundle loading and extension points (`BundleManager`)

`BundleManager` is the main composition point for runtime features. It loads:

- `attributes.js`
- `behaviors/`
- `commands/`
- `input-events/`
- `server-events/`
- `player-events.js`
- `skills/`
- area content (`quests`, `items`, `npcs`, `rooms`)

There is no built-in `shops` or `economy` load step, which implies shop logic is intended to be assembled from generic primitives.

**Relevant methods:**

- `loadBundle(...)`
- `loadCommands(...)`
- `loadBehaviors(...)`
- `loadAttributes(...)`
- `loadEntities(...)`
- `loadEntityScript(...)`

### Entities and factories

Shops are typically expressed using existing entity types:

- `Npc` as the merchant actor
- `Item` as tradable assets
- `Player` as buyer/seller

`EntityFactory` plus concrete factories (`MobFactory`, `ItemFactory`) provide creation/cloning and script attachment hooks.

---

## Class and API deep-dive

## 1) Merchant host: `Npc`

`Npc` extends `Character` and mixes in `Scriptable`, so it can:

- Hold inventory/equipment via inherited `Character` APIs
- Attach behavior listeners at hydration (`setupBehaviors(state.MobBehaviorManager)`)
- Execute command queue logic if bundles implement NPC action scripts

**Shop relevance:**

- Merchant stock can be represented as default NPC inventory (`defaultItems`) and/or generated items
- Merchant logic can live in NPC behaviors and script listeners

---

## 2) Buyer/seller actor model: `Character` / `Player`

`Character` provides the core operational APIs used in buy/sell flows:

- `addItem(item)`
- `removeItem(item)`
- `isInventoryFull()`
- Equipment transfer operations (`equip`, `unequip`) when trade includes equipped items

`Player` adds persistence-sensitive behavior and command queuing but inherits transfer semantics from `Character`.

**Key technical detail:** transfer is primitive and explicit; there is no atomic transaction abstraction. Bundle command code must validate and apply all steps consistently.

---

## 3) Tradable object model: `Item`

`Item` contains the fields most commonly used by shop systems:

- `metadata` (arbitrary JSON-safe blob)
- `behaviors` (runtime behavior config)
- container support (`inventory`, `maxItems`, open/close/lock state)

### Why `metadata` matters for commerce

`metadata` is the natural location for commerce-oriented item flags and values (examples):

- base price
- currency type
- rarity multiplier
- sellability or binding rules

`Item.serialize()` persists `metadata` and behavior config, enabling dynamic market state to survive saves if bundle logic mutates those values.

---

## 4) Inventory transfer substrate: `Inventory`

`Inventory` extends `Map<uuid, Item>` and provides:

- `addItem(item)` with capacity check
- `removeItem(item)`
- `isFull` capacity guard
- serialize/hydrate support

`addItem` throws `InventoryFullError` when full. This is the primary exception path command logic must handle for purchases or barter transfers.

---

## 5) Command integration: `Command` + `CommandManager`

Commerce entrypoints are expected to be normal commands loaded from bundles.

- `CommandManager.add(command)` registers name + aliases
- `CommandManager.find(search, returnAlias)` resolves partial names/aliases
- `Command.execute(args, player, arg0)` executes command function

This is the canonical integration layer for `buy`, `sell`, `list`, `value`, `trade`, etc.

---

## 6) Behavior/event integration: `BehaviorManager`, `EventManager`, `Scriptable`

Behavior architecture enables shop logic to be attached without adding core classes:

- `BehaviorManager` stores named behavior event sets
- `EventManager.attach(emitter, config)` binds listeners to events
- `Scriptable.setupBehaviors(manager)` attaches configured behaviors to entities

`BundleManager.loadBehaviors(...)` wires behavior files under `behaviors/{npc,item,room,area}` into the corresponding managers.

For entity-specific scripts, `loadEntityScript(...)` registers listeners directly against factory script managers.

**Practical implication:** merchant logic can be centralized in reusable behaviors, while special merchants can override/extend via per-entity script listeners.

---

## 7) Currency representation options in core

Core does not dictate one currency model. Two practical models are supported by current APIs.

### A) Attribute-backed currency

Attributes are loaded from bundle `attributes.js`, registered in `AttributeFactory`, then instantiated on characters.

Operational APIs:

- Read: `getAttribute(attr)`, `getMaxAttribute(attr)`, `getBaseAttribute(attr)`
- Mutate transient delta: `raiseAttribute(attr, amount)`, `lowerAttribute(attr, amount)`
- Mutate permanent baseline: `setAttributeBase(attr, newBase)`

**Typical use:** treat `gold` (or equivalent) as an attribute.

### B) Metadata-backed currency

All `Metadatable` entities expose:

- `setMeta(path, value)`
- `getMeta(path)`

`Player.serialize()` persists metadata.

**Typical use:** keep nested wallet/account ledgers under metadata, e.g. `currency.gold`, `wallet.bank`, `wallet.tokens`.

### Notes on choosing between A and B

From a purely technical perspective in this engine:

- Attributes integrate naturally with existing character stat mutation and event pipelines
- Metadata is structurally flexible for multi-currency/accounting schemas
- Some bundles may combine both (e.g., one “displayed” currency attribute + metadata for richer accounting state)

---

## End-to-end buy/sell/exchange wiring (technical sequence)

This is the mechanical sequence bundle code usually follows:

1. Command dispatcher resolves and executes a trade command.
2. Command identifies merchant NPC and target item(s).
3. Command/behavior computes or reads price using item/NPC metadata and optional attributes.
4. Validate constraints:
   - buyer funds available
   - destination inventory capacity
   - any merchant/item policy checks
5. Apply state mutations in explicit order:
   - adjust currency (attribute or metadata)
   - remove item from source inventory
   - add item to destination inventory
6. Emit/broadcast messaging using existing game messaging/event pathways in bundle code.
7. Persist naturally through existing entity serialize/hydrate paths.

Because there is no transaction primitive, bundle code should be careful to order operations and handle failures (e.g. inventory full) deterministically.

---

## Persistence and hydration behavior relevant to commerce

- `Player.hydrate(...)` hydrates inventory/equipment and account references.
- `Item.hydrate(...)` restores metadata/behaviors and nested inventory.
- `Inventory.hydrate(...)` resolves serialized item definitions into live items via `ItemFactory`.

This means dynamic stock/currency systems can persist if they are represented through serializable fields (metadata, attributes, inventory state).

---

## Explicit gaps in core (current constraints)

The following are not currently provided by core as dedicated APIs:

- Price calculation service
- Currency normalization/conversion service
- Transaction rollback/atomicity helper
- Standardized merchant stock policy abstraction
- Built-in buy/sell/exchange command set

These gaps are not defects per se; they are consequences of the engine’s extensibility-first architecture.

---

## Suggested reference points for implementers

When implementing or auditing shop systems in bundles, the most relevant core modules are:

- `src/BundleManager.js`
- `src/CommandManager.js`
- `src/Command.js`
- `src/Npc.js`
- `src/Character.js`
- `src/Player.js`
- `src/Item.js`
- `src/Inventory.js`
- `src/BehaviorManager.js`
- `src/EventManager.js`
- `src/Scriptable.js`
- `src/AttributeFactory.js`
- `src/Attribute.js`
- `src/Metadatable.js`

---

## Conclusion

In this engine, shops and currency are **composed systems**, not first-class core constructs. The implementation surface is broad enough to support robust commerce, but correctness and consistency live in bundle-level command and behavior code.

For maintainers, this means technical reviews of shop functionality should focus on:

- command flow correctness,
- behavior/event coupling,
- deterministic transfer sequencing,
- and persistence representation (attributes/metadata/inventory).

