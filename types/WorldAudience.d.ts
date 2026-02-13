export = WorldAudience;
/**
 * Audience class representing everyone in the game, except sender.
 * @memberof ChannelAudience
 * @extends ChannelAudience
 */
declare class WorldAudience extends ChannelAudience {
    getBroadcastTargets(): unknown;
}
import ChannelAudience = require("./ChannelAudience");
