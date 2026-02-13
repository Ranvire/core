export = Quest;
/**
 * @property {object} config Default config for this quest, see individual quest types for details
 * @property {Player} player
 * @property {object} state  Current completion state
 * @extends EventEmitter
 */
declare class Quest extends EventEmitter {
    constructor(GameState: unknown, id: unknown, config: unknown, player: unknown);
    id: unknown;
    entityReference: unknown;
    config: unknown;
    player: unknown;
    goals: unknown[];
    state: unknown[];
    GameState: unknown;
    addGoal(goal: unknown): void;
    /**
     * @fires Quest#turn-in-ready
     * @fires Quest#progress
     */
    onProgressUpdated(): void;
    /**
     * @return {{ percent: number, display: string }}
     */
    getProgress(): {
        percent: number;
        display: string;
    };
    /**
     * Save the current state of the quest on player save
     * @return {object}
     */
    serialize(): object;
    hydrate(): void;
    /**
     * @fires Quest#complete
     */
    complete(): void;
}
import EventEmitter = require("node:events");
