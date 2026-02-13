export = BehaviorManager;
/**
 * BehaviorManager keeps a map of BehaviorName:EventManager which is used
 * during Item and NPC hydrate() methods to attach events
 */
declare class BehaviorManager {
    behaviors: Map<unknown, unknown>;
    /**
     * Get EventManager for a given behavior
     * @param {string} name
     * @return {EventManager}
     */
    get(name: string): EventManager;
    /**
     * Check to see if a behavior exists
     * @param {string} name
     * @return {boolean}
     */
    has(name: string): boolean;
    /**
     * @param {string}   behaviorName
     * @param {Function} listener
     */
    addListener(behaviorName: string, event: unknown, listener: Function): void;
}
import EventManager = require("./EventManager");
