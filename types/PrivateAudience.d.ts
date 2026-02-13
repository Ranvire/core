export = PrivateAudience;
/**
 * Audience class representing a specific targeted player.
 * Example: `tell` command or `whisper` command.
 * @memberof ChannelAudience
 * @extends ChannelAudience
 */
declare class PrivateAudience extends ChannelAudience {
    alterMessage(message: unknown): unknown;
}
import ChannelAudience = require("./ChannelAudience");
