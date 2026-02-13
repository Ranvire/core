export = QuestRewardManager;
/**
 * Simple map of quest reward name => class instance
 */
declare class QuestRewardManager extends Map<string, QuestRewardType> {
    constructor();
    constructor(entries?: readonly (readonly [string, QuestRewardType])[]);
    constructor(iterable?: Iterable<readonly [string, QuestRewardType]>);
}
import QuestReward = require("./QuestReward");
type QuestRewardType = typeof QuestReward;
