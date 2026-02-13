export = Effect;
/**
 * See the {@link http://ranviermud.com/extending/effects/|Effect guide} for usage.
 * @property {object}  config Effect configuration (name/desc/duration/etc.)
 * @property {boolean} config.autoActivate If this effect immediately activates itself when added to the target
 * @property {boolean} config.hidden       If this effect is shown in the character's effect list
 * @property {boolean} config.refreshes    If an effect with the same type is applied it will trigger an effectRefresh
 *   event instead of applying the additional effect.
 * @property {boolean} config.unique       If multiple effects with the same `config.type` can be applied at once
 * @property {number}  config.maxStacks    When adding an effect of the same type it adds a stack to the current
 *     effect up to maxStacks instead of adding the effect. Implies `config.unique`
 * @property {boolean} config.persists     If false the effect will not save to the player
 * @property {string}  config.type         The effect category, mainly used when disallowing stacking
 * @property {boolean|number} config.tickInterval Number of seconds between calls to the `updateTick` listener
 * @property {string}    description
 * @property {number}    duration    Total duration of effect in _milliseconds_
 * @property {number}    elapsed     Get elapsed time in _milliseconds_
 * @property {string}    id     filename minus .js
 * @property {EffectModifiers} modifiers Attribute modifier functions
 * @property {string}    name
 * @property {number}    remaining Number of seconds remaining
 * @property {number}    startedAt Date.now() time this effect became active
 * @property {object}    state  Configuration of this _type_ of effect (magnitude, element, stat, etc.)
 * @property {Character} target Character this effect is... effecting
 * @extends EventEmitter
 *
 * @listens Effect#effectAdded
 */
declare class Effect extends EventEmitter {
    constructor(id: string, def: EffectDefinition);
    id: string;
    flags: string[];
    config: EffectConfig;
    startedAt: number;
    paused: number | null;
    modifiers: EffectModifiers;
    state: Record<string, unknown>;
    /**
     * @type {string}
     */
    get name(): string;
    /**
     * @type {string}
     */
    get description(): string;
    set duration(dur: number);
    /**
     * @type {number}
     */
    get duration(): number;
    /**
     * Elapsed time in milliseconds since event was activated
     * @type {number}
     */
    get elapsed(): number | null;
    /**
     * Remaining time in seconds
     * @type {number}
     */
    get remaining(): number;
    /**
     * Whether this effect has lapsed
     * @return {boolean}
     */
    isCurrent(): boolean;
    /**
     * Set this effect active
     * @fires Effect#effectActivated
     */
    activate(): void;
    active: boolean;
    /**
     * Set this effect active
     * @fires Effect#effectDeactivated
     */
    deactivate(): void;
    /**
     * Remove this effect from its target
     * @fires Effect#remove
     */
    remove(): void;
    /**
     * Stop this effect from having unknown effect temporarily
     */
    pause(): void;
    /**
     * Resume a paused effect
     */
    resume(): void;
    /**
     * @param {string} attrName
     * @param {number} currentValue
     * @return {number} attribute modified by effect
     */
    modifyAttribute(attrName: string, currentValue: number): number;
    /**
     * @param {Damage} damage
     * @param {number} currentAmount
     * @return {Damage}
     */
    modifyIncomingDamage(damage: Damage, currentAmount: number): number;
    /**
     * @param {Damage} damage
     * @param {number} currentAmount
     * @return {Damage}
     */
    modifyOutgoingDamage(damage: Damage, currentAmount: number): number;
    /**
     * Gather data to persist
     * @return {Object}
     */
    serialize(): SerializedEffect;
    /**
     * Reinitialize from persisted data
     * @param {GameState}
     * @param {Object} data
     */
    hydrate(state: GameState, data: SerializedEffect): void;
    skill?: Skill;
    target?: Character;
}
declare namespace Effect {
    export { EffectConfig, EffectDefinition, EffectModifiers, SerializedEffect };
}
import EventEmitter = require("node:events");
import Damage = require("./Damage");
import GameState = require("./GameState");
import Skill = require("./Skill");
import Character = require("./Character");
/**
 * {{attributes: !Object<string,function>}}
 */
type EffectModifiers = {
    attributes: Record<string, (current: number) => number> | ((attrName: string, current: number) => number);
    incomingDamage: (damage: Damage, current: number) => number;
    outgoingDamage: (damage: Damage, current: number) => number;
};
type EffectConfig = {
    autoActivate: boolean;
    description: string;
    duration: number;
    hidden: boolean;
    maxStacks: number;
    name: string;
    persists: boolean;
    refreshes: boolean;
    tickInterval: boolean | number;
    type: string;
    unique: boolean;
    [key: string]: unknown;
};
type EffectDefinition = {
    flags?: string[];
    config?: Partial<EffectConfig>;
    modifiers?: Partial<EffectModifiers>;
    state?: Record<string, unknown>;
};
type SerializedEffect = {
    config: Omit<EffectConfig, "duration"> & {
        duration: number | "inf";
    };
    elapsed: number | null;
    id: string;
    remaining: number;
    skill?: string;
    state: Record<string, unknown>;
};
