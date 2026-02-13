/**
 * @property {ChannelAudience} audience People who receive messages from this channel
 * @property {string} name  Actual name of the channel the user will type
 * @property {string} color Default color. This is purely a helper if you're using default format methods
 * @property {PlayerRoles} minRequiredRole If set only players with the given role or greater can use the channel
 * @property {string} description
 * @property {{sender: function, target: function}} [formatter]
 */
export class Channel {
    /**
     * @param {object}  config
     * @param {string} config.name Name of the channel
     * @param {ChannelAudience} config.audience
     * @param {string} [config.description]
     * @param {PlayerRoles} [config.minRequiredRole]
     * @param {string} [config.color]
     * @param {{sender: function, target: function}} [config.formatter]
     */
    constructor(config: {
        name: string;
        audience: ChannelAudience;
        description?: string;
        minRequiredRole?: PlayerRoles;
        color?: string;
        formatter?: {
            sender: Function;
            target: Function;
        };
    });
    name: string;
    minRequiredRole: unknown;
    description: string;
    bundle: unknown;
    audience: unknown;
    color: string;
    aliases: unknown;
    formatter: {
        sender: unknown;
        target: unknown;
    };
    /**
     * @param {GameState} state
     * @param {Player}    sender
     * @param {string}    message
     * @fires GameEntity#channelReceive
     */
    send(state: GameState, sender: Player, message: string): void;
    describeSelf(sender: unknown): void;
    getUsage(): string;
    /**
     * How to render the message the player just sent to the channel
     * E.g., you may want "chat" to say "You chat, 'message here'"
     * @param {Player} sender
     * @param {string} message
     * @param {Function} colorify
     * @return {string}
     */
    formatToSender(sender: Player, target: unknown, message: string, colorify: Function): string;
    /**
     * How to render the message to everyone else
     * E.g., you may want "chat" to say "Playername chats, 'message here'"
     * @param {Player} sender
     * @param {Player} target
     * @param {string} message
     * @param {Function} colorify
     * @return {string}
     */
    formatToReceipient(sender: Player, target: Player, message: string, colorify: Function): string;
    colorify(message: unknown): unknown;
}
export class NoPartyError extends Error {
}
export class NoRecipientError extends Error {
}
export class NoMessageError extends Error {
}
