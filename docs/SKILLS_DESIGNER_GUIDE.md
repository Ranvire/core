# Skills for Designers: How They Work and How to Build One

This guide explains how to wire a gameplay skill (for example, `climb`) in a content bundle.

## Mental model

- A **command** handles text input (`climb wall`) and world/context checks.
- A **skill** handles reusable gameplay rules (cooldown, resource costs, active/passive behavior).
- Core loads skills from bundle `skills/` files and registers them in `SkillManager` or `SpellManager`.

Typical runtime flow:

1. Player types `climb wall`.
2. Command `commands/climb.js` is executed.
3. Command looks up `climb` from `state.SkillManager`.
4. Command identifies/validates the target (the wall in the current room).
5. Command calls `skill.execute(args, player, target)`.
6. Core enforces skill checks (passive check, cooldown, resources), then runs your skill logic.

## Where designers put files

In a bundle:

- `commands/climb.js`
- `skills/climb.js`

The `BundleManager` loads commands and skills from those directories.

## Example: `skills/climb.js`

```js
'use strict';

const SkillFlag = require('ranvier').SkillFlag;
const SkillType = require('ranvier').SkillType;

module.exports = {
  name: 'Climb',
  type: SkillType.SKILL,
  flags: [SkillFlag.ACTIVE],

  // Optional: can be number (seconds) or { group, length }
  cooldown: 3,

  // Optional resource cost example
  // resource: { attribute: 'stamina', cost: 10 },

  requiresTarget: true,
  targetSelf: false,
  initiatesCombat: false,

  // Bundle loader calls this with state; return the runtime executor
  run: state => (args, player, target) => {
    // The command should already verify target exists and is climbable.
    // Here we apply the gameplay result.

    // Example outcome:
    if (!target || !target.metadata || !target.metadata.climbDestination) {
      player.say("You can't climb that.");
      return false; // no cooldown/resource cost
    }

    const destination = target.metadata.climbDestination;
    player.moveTo(destination, () => {
      player.command('look');
    });

    player.say('You climb up.');
    return true; // apply cooldown/resource cost if configured
  },

  info: () => 'Climb climbable objects to reach connected places.',
};
```

## Example: `commands/climb.js`

```js
'use strict';

const { SkillErrors } = require('ranvier');

module.exports = {
  aliases: [ 'cl' ],
  usage: 'climb <target>',

  command: state => (args, player) => {
    const search = (args || '').trim().toLowerCase();
    if (!search) {
      return player.say('Climb what?');
    }

    const skill = state.SkillManager.get('climb');
    if (!skill) {
      return player.say("You don't know how to climb.");
    }

    // Example targeting strategy:
    // - find room item/scenery by keyword
    // - ensure it is marked climbable
    const room = player.room;
    const target = room && room.items && room.items.find(item => {
      if (!item || !item.name) return false;
      return item.name.toLowerCase().includes(search);
    });

    if (!target) {
      return player.say("You don't see that here.");
    }

    if (!target.metadata || !target.metadata.climbable) {
      return player.say("You can't climb that.");
    }

    try {
      skill.execute(args, player, target);
    } catch (err) {
      if (err instanceof SkillErrors.PassiveError) {
        return player.say("That ability can't be used actively.");
      }

      if (err instanceof SkillErrors.CooldownError) {
        return player.say('You need to catch your breath first.');
      }

      if (err instanceof SkillErrors.NotEnoughResourcesError) {
        return player.say('You are too exhausted to climb right now.');
      }

      throw err;
    }
  }
};
```

## What to decide as a designer

For each skill, decide:

- **Triggering**: Is this player-invoked (command) or passive?
- **Targeting**: Does it require a target? Can it target self?
- **Economy**: Should it cost stamina/mana/etc.?
- **Pacing**: Should it have a cooldown? shared cooldown group?
- **Failure UX**: What message should players get for each failure reason?

## Common pitfalls

- Don’t put heavy target parsing in `skills/*`; do most parsing in `commands/*`.
- Don’t forget to handle `SkillErrors` in commands for clean player feedback.
- Return `false` from a skill `run` function when you intentionally want to skip cooldown/cost.
- Passive skills should define an effect and be activated, not executed.
