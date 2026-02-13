export = RoleAudience;
declare class RoleAudience extends ChannelAudience {
    constructor(options: RoleAudienceOptions);
    minRole: number;
    getBroadcastTargets(): ReturnType<ChannelAudience["getBroadcastTargets"]>;
}
import ChannelAudience = require("./ChannelAudience");
type RoleAudienceOptions = {
    minRole: number;
    // Channel audience options may include additional fields used by callers.
    [key: string]: unknown;
};
