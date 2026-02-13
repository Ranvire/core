export = RoleAudience;
declare class RoleAudience extends ChannelAudience {
    constructor(options: unknown);
    minRole: unknown;
    getBroadcastTargets(): ReturnType<ChannelAudience["getBroadcastTargets"]>;
}
import ChannelAudience = require("./ChannelAudience");
