export = EffectFactory;
/**
 * @property {Map} effects
 */
declare class EffectFactory {
    effects: Map<unknown, unknown>;
    /**
     * @param {string} id
     * @param {EffectConfig} config
     * @param {GameState} state
     */
    add(id: string, config: EffectConfig, state: GameState): void;
    has(id: unknown): boolean;
    /**
     * Get a effect definition. Use `create` if you want an instance of a effect
     * @param {string} id
     * @return {object}
     */
    get(id: string): object;
    /**
     * @param {string}  id      effect id
     * @param {?object} config  Effect.config override
     * @param {?object} state   Effect.state override
     * @return {Effect}
     */
    create(id: string, config?: object | null, state?: object | null): Effect;
}
type EffectConfig = {
    config: {
        [x: string]: unknown;
    };
    listeners: unknown;
};
/** @typedef {{config: Object<string,*>, listeners: Object<String,function (...*)>}} */
declare var EffectConfig: unknown;
import Effect = require("./Effect");
import GameState = require("./GameState");
