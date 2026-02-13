export = PartyAudience;
/**
 * Audience class representing other players in the same group as the sender
 * @memberof ChannelAudience
 * @extends ChannelAudience
 */
declare class PartyAudience extends ChannelAudience {
    getBroadcastTargets(): unknown;
}
import ChannelAudience = require("./ChannelAudience");
