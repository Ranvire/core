export = QuestGoalManager;
/**
 * Simple map of quest goal name => class definition
 */
declare class QuestGoalManager extends Map<unknown, unknown> {
    constructor();
    constructor(entries?: readonly (readonly [unknown, unknown])[]);
    constructor();
    constructor(iterable?: Iterable<readonly [unknown, unknown]>);
}
