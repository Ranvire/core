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
declare class Effect extends EventEmitter<unknown> {
    constructor(id: unknown, def: unknown);
    id: unknown;
    flags: unknown;
    config: unknown;
    startedAt: number;
    paused: number;
    modifiers: unknown;
    state: unknown;
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
    get elapsed(): number;
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
    modifyIncomingDamage(damage: Damage, currentAmount: number): Damage;
    /**
     * @param {Damage} damage
     * @param {number} currentAmount
     * @return {Damage}
     */
    modifyOutgoingDamage(damage: Damage, currentAmount: number): Damage;
    /**
     * Gather data to persist
     * @return {Object}
     */
    serialize(): unknown;
    /**
     * Reinitialize from persisted data
     * @param {GameState}
     * @param {Object} data
     */
    hydrate(state: unknown, data: unknown): void;
    skill: unknown;
}
declare namespace Effect {
    export { EffectModifiers };
}
import EventEmitter = require("node:events");
/**
 * {{attributes: !Object<string,function>}}
 */
type EffectModifiers = unknown;
