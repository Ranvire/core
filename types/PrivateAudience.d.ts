export = PrivateAudience;
/**
 * Audience class representing a specific targeted player.
 * Example: `tell` command or `whisper` command.
 * @memberof ChannelAudience
 * @extends ChannelAudience
 */
declare class PrivateAudience extends ChannelAudience {
    alterMessage(message: string): string;
}
import ChannelAudience = require("./ChannelAudience");
