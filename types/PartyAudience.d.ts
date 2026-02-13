export = PartyAudience;
/**
 * Audience class representing other players in the same group as the sender
 * @memberof ChannelAudience
 * @extends ChannelAudience
 */
declare class PartyAudience extends ChannelAudience {
    getBroadcastTargets(): ReturnType<ChannelAudience["getBroadcastTargets"]>;
}
import ChannelAudience = require("./ChannelAudience");
