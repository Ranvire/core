export = Party;
/**
 * Representation of an adventuring party
 */
declare class Party extends Set<unknown> {
    constructor(leader: unknown);
    invited: Set<unknown>;
    leader: unknown;
    disband(): void;
    invite(target: unknown): void;
    isInvited(target: unknown): boolean;
    removeInvite(target: unknown): void;
    getBroadcastTargets(): unknown[];
}
