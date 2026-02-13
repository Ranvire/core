export = RoleAudience;
declare class RoleAudience extends ChannelAudience {
    constructor(options: unknown);
    minRole: unknown;
    getBroadcastTargets(): unknown;
}
import ChannelAudience = require("./ChannelAudience");
