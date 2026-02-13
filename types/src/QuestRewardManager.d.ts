export = QuestRewardManager;
/**
 * Simple map of quest reward name => class instance
 */
declare class QuestRewardManager extends Map<unknown, unknown> {
    constructor();
    constructor(entries?: readonly (readonly [unknown, unknown])[]);
    constructor();
    constructor(iterable?: Iterable<readonly [unknown, unknown]>);
}
