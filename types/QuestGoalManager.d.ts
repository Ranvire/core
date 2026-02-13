export = QuestGoalManager;
/**
 * Simple map of quest goal name => class definition
 */
declare class QuestGoalManager extends Map<string, QuestGoalType> {
    constructor();
    constructor(entries?: readonly (readonly [string, QuestGoalType])[]);
    constructor(iterable?: Iterable<readonly [string, QuestGoalType]>);
}
import Quest = require("./Quest");
import Player = require("./Player");
import QuestGoal = require("./QuestGoal");
type QuestGoalType = new (quest: Quest, config: Record<string, unknown>, player: Player) => QuestGoal;
