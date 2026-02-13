export = EffectList;
/**
 * Self-managing list of effects for a target
 * @property {Set}    effects
 * @property {number} size Number of currently active effects
 * @property {Character} target
 */
declare class EffectList {
    /**
     * @param {Character} target
     * @param {Array<Object|Effect>} effects array of serialized effects (Object) or actual Effect instances
     */
    constructor(target: Character, effects: Array<Effect | SerializedEffect>);
    effects: Set<Effect | SerializedEffect>;
    target: Character;
    /**
     * @type {number}
     */
    get size(): number;
    /**
     * Get current list of effects as an array
     * @return {Array<Effect>}
     */
    entries(): Array<Effect>;
    /**
     * @param {string} type
     * @return {boolean}
     */
    hasEffectType(type: string): boolean;
    /**
     * @param {string} type
     * @return {Effect}
     */
    getByType(type: string): Effect;
    /**
     * Proxy an event to all effects
     * @param {string} event
     * @param {...*}   args
     */
    emit(event: string, ...args: unknown[]): void;
    /**
     * @param {Effect} effect
     * @fires Effect#effectAdded
     * @fires Effect#effectStackAdded
     * @fires Effect#effectRefreshed
     * @fires Character#effectAdded
     */
    add(effect: Effect): boolean;
    /**
     * Deactivate and remove an effect
     * @param {Effect} effect
     * @throws ReferenceError
     * @fires Character#effectRemoved
     */
    remove(effect: Effect): void;
    /**
     * Remove all effects, bypassing all deactivate and remove events
     */
    clear(): void;
    /**
     * Ensure effects are still current and if not remove them
     */
    validateEffects(): void;
    /**
     * Gets the effective "max" value of an attribute (before subtracting delta).
     * Does the work of actaully applying attribute modification
     * @param {Atrribute} attr
     * @return {number}
     */
    evaluateAttribute(attr: Atrribute): number;
    /**
     * @param {Damage} damage
     * @param {number} currentAmount
     * @return {number}
     */
    evaluateIncomingDamage(damage: Damage, currentAmount: number): number;
    /**
     * @param {Damage} damage
     * @param {number} currentAmount
     * @return {number}
     */
    evaluateOutgoingDamage(damage: Damage, currentAmount: number): number;
    serialize(): SerializedEffect[];
    hydrate(state: GameState): void;
}
import Character = require("./Character");
import Damage = require("./Damage");
import Effect = require("./Effect");
import GameState = require("./GameState");
type SerializedEffect = import("./Effect").SerializedEffect;
type Atrribute = {
    name: string;
    base?: number;
};
