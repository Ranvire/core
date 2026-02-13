export = QuestFactory;
/**
 * @property {Map} quests
 */
declare class QuestFactory {
    quests: Map<entityReference, QuestFactoryDefinition>;
    add(areaName: string, id: string | number, config: QuestConfig): void;
    set(qid: entityReference, val: QuestFactoryDefinition): void;
    /**
     * Get a quest definition. Use `create` if you want an instance of a quest
     * @param {string} qid
     * @return {object}
     */
    get(qid: string): QuestFactoryDefinition | undefined;
    /**
     * Check to see if a player can start a given quest based on the quest's
     * prerequisite quests
     * @param {entityReference} questRef
     * @return {boolean}
     */
    canStart(player: Player, questRef: entityReference): boolean;
    /**
     * @param {GameState} GameState
     * @param {entityReference} qid
     * @param {Player}    player
     * @param {Array}     state     current quest state
     * @return {Quest}
     */
    create(GameState: GameState, qid: entityReference, player: Player, state?: QuestGoalState[]): Quest;
    /**
     * @param {string} areaName
     * @param {number} id
     * @return {string}
     */
    makeQuestKey(area: string, id: number): string;
}
import GameState = require("./GameState");
import Quest = require("./Quest");
import Player = require("./Player");
type entityReference = string;
type QuestConfig = ConstructorParameters<typeof Quest>[2];
type QuestGoalState = ConstructorParameters<typeof Quest>[0] extends never ? never : {
    state: Record<string, unknown>;
    [key: string]: unknown;
};
type QuestFactoryDefinition = {
    id: string | number;
    area: string;
    config: QuestConfig;
    npc?: string;
};
