export = QuestTracker;
/**
 * Keeps track of player quest progress
 *
 * @property {Player} player
 * @property {Map}    completedQuests
 * @property {Map}    activeQuests
 */
declare class QuestTracker {
    /**
     * @param {Player} player
     * @param {Array}  active
     * @param {Array}  completed
     */
    constructor(player: Player, active: unknown[], completed: unknown[]);
    player: Player;
    activeQuests: Map<unknown, unknown>;
    completedQuests: Map<unknown, unknown>;
    /**
     * Proxy events to all active quests
     * @param {string} event
     * @param {...*}   args
     */
    emit(event: string, ...args: unknown[]): void;
    /**
     * @param {EntityReference} qid
     * @return {boolean}
     */
    isActive(qid: EntityReference): boolean;
    /**
     * @param {EntityReference} qid
     * @return {boolean}
     */
    isComplete(qid: EntityReference): boolean;
    get(qid: unknown): unknown;
    /**
     * @param {EntityReference} qid
     */
    complete(qid: EntityReference): void;
    /**
     * @param {Quest} quest
     */
    start(quest: Quest): void;
    /**
     * @param {GameState} state
     * @param {object}    questData Data pulled from the pfile
     */
    hydrate(state: GameState): void;
    /**
     * @return {object}
     */
    serialize(): object;
}
