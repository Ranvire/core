export = QuestFactory;
/**
 * @property {Map} quests
 */
declare class QuestFactory {
    quests: Map<unknown, unknown>;
    add(areaName: unknown, id: unknown, config: unknown): void;
    set(qid: unknown, val: unknown): void;
    /**
     * Get a quest definition. Use `create` if you want an instance of a quest
     * @param {string} qid
     * @return {object}
     */
    get(qid: string): object;
    /**
     * Check to see if a player can start a given quest based on the quest's
     * prerequisite quests
     * @param {entityReference} questRef
     * @return {boolean}
     */
    canStart(player: unknown, questRef: entityReference): boolean;
    /**
     * @param {GameState} GameState
     * @param {entityReference} qid
     * @param {Player}    player
     * @param {Array}     state     current quest state
     * @return {Quest}
     */
    create(GameState: unknown, qid: entityReference, player: Player, state?: unknown[]): Quest;
    /**
     * @param {string} areaName
     * @param {number} id
     * @return {string}
     */
    makeQuestKey(area: unknown, id: number): string;
}
import Quest = require("./Quest");
