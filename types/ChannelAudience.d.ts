export = ChannelAudience;
/**
 * Classes representing various channel audiences
 *
 * See the {@link http://ranviermud.com/extending/channels/|Channel guide} for usage
 * @namespace ChannelAudience
 */
/**
 * Base channel audience class
 */
declare class ChannelAudience {
    /**
     * Configure the current state for the audience. Called by {@link Channel#send}
     * @param {object} options
     * @param {GameState} options.state
     * @param {Player} options.sender
     * @param {string} options.message
     */
    configure(options: {
        state: GameState;
        sender: Player;
        message: string;
    }): void;
    state: GameState;
    sender: Player;
    message: string;
    /**
     * Find targets for this audience
     * @return {Array<Player>}
     */
    getBroadcastTargets(): Array<Player>;
    /**
     * Modify the message to be sent
     * @param {string} message
     * @return {string}
     */
    alterMessage(message: string): string;
}
import Player = require("./Player");
import GameState = require("./GameState");
