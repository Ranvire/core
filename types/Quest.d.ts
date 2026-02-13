export = Quest;
/**
 * @property {object} config Default config for this quest, see individual quest types for details
 * @property {Player} player
 * @property {object} state  Current completion state
 * @extends EventEmitter
 */
declare class Quest extends EventEmitter {
    constructor(GameState: GameState, id: string, config: QuestConfig, player: Player);
    id: string;
    entityReference: string;
    config: QuestConfig;
    player: Player;
    goals: QuestGoal[];
    state: QuestGoalState[];
    GameState: GameState;
    addGoal(goal: QuestGoal): void;
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
    serialize(): QuestSerializedState;
    hydrate(): void;
    /**
     * @fires Quest#complete
     */
    complete(): void;
}
import EventEmitter = require("node:events");
import GameState = require("./GameState");
import Player = require("./Player");
import QuestGoal = require("./QuestGoal");
type QuestConfig = {
    entityReference: string;
    title?: string;
    description?: string;
    completionMessage?: string | null;
    requires?: string[];
    level?: number;
    autoComplete?: boolean;
    repeatable?: boolean;
    rewards?: Array<Record<string, unknown>>;
    goals?: Array<Record<string, unknown>>;
    [key: string]: unknown;
};
type QuestGoalState = {
    state: Record<string, unknown>;
    [key: string]: unknown;
};
type QuestSerializedState = {
    state: ReturnType<QuestGoal["serialize"]>[];
    progress: {
        percent: number;
        display: string;
    };
    config: {
        desc: string | undefined;
        level: number | undefined;
        title: string | undefined;
    };
};
