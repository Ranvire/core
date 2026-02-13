export = RoomAudience;
/**
 * Audience class representing other players in the same room as the sender
 * Could even be used to broadcast to NPCs if you want them to pick up on dialogue,
 * just make them broadcastables.
 *
 * @memberof ChannelAudience
 * @extends ChannelAudience
 */
declare class RoomAudience extends ChannelAudience {
    getBroadcastTargets(): unknown;
}
import ChannelAudience = require("./ChannelAudience");
