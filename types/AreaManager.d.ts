export = AreaManager;
/**
 * Stores references to, and handles distribution of, active areas
 * @property {Map<string,Area>} areas
 */
declare class AreaManager {
    areas: Map<string, Area>;
    scripts: BehaviorManager;
    /**
     * @param {string} name
     * @return Area
     */
    getArea(name: string): Area | undefined;
    /**
     * @param {string} entityRef
     * @return Area
     */
    getAreaByReference(entityRef: string): Area | undefined;
    /**
     * @param {Area} area
     */
    addArea(area: Area): void;
    /**
     * @param {Area} area
     */
    removeArea(area: Area): void;
    /**
     * Apply `updateTick` to all areas in the game
     * @param {GameState} state
     * @fires Area#updateTick
     */
    tickAll(state: GameState): void;
    /**
     * Get the placeholder area used to house players who were loaded into
     * an invalid room
     *
     * @return {Area}
     */
    getPlaceholderArea(): Area;
    _placeholder?: Area;
}
import BehaviorManager = require("./BehaviorManager");
import Area = require("./Area");
import GameState = require("./GameState");
