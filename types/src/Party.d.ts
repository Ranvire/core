export = Party;
/**
 * Representation of an adventuring party
 */
declare class Party extends Set<unknown> {
    constructor(leader: unknown);
    invited: Set<unknown>;
    leader: unknown;
    delete(member: unknown): void;
    add(member: unknown): void;
    disband(): void;
    invite(target: unknown): void;
    isInvited(target: unknown): boolean;
    removeInvite(target: unknown): void;
    getBroadcastTargets(): unknown[];
}
