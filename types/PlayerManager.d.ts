export = PlayerManager;
/**
 * Keeps track of all active players in game
 * @extends EventEmitter
 * @property {Map} players
 * @property {EventManager} events Player events
 * @property {EntityLoader} loader
 * @listens PlayerManager#save
 * @listens PlayerManager#updateTick
 */
declare class PlayerManager extends EventEmitter<unknown> {
    constructor();
    players: Map<unknown, unknown>;
    events: EventManager;
    loader: unknown;
    /**
     * Set the entity loader from which players are loaded
     * @param {EntityLoader}
     */
    setLoader(loader: unknown): void;
    /**
     * @param {string} name
     * @return {Player}
     */
    getPlayer(name: string): Player;
    /**
     * @param {Player} player
     */
    addPlayer(player: Player): void;
    /**
     * Remove the player from the game. WARNING: You must manually save the player first
     * as this will modify serializable properties
     * @param {Player} player
     * @param {boolean} killSocket true to also force close the player's socket
     */
    removePlayer(player: Player, killSocket?: boolean): void;
    /**
     * @return {array}
     */
    getPlayersAsArray(): unknown[];
    /**
     * @param {string}   behaviorName
     * @param {Function} listener
     */
    addListener(event: unknown, listener: Function): void;
    /**
     * @param {Function} fn Filter function
     * @return {array}
     */
    filter(fn: Function): unknown[];
    /**
     * Load a player for an account
     * @param {GameState} state
     * @param {Account} account
     * @param {string} username
     * @param {boolean} force true to force reload from storage
     * @return {Player}
     */
    loadPlayer(state: GameState, account: Account, username: string, force: boolean): Player;
    /**
     * Turn player into a key used by this class's map
     * @param {Player} player
     * @return {string}
     */
    keyify(player: Player): string;
    /**
     * @param {string} name
     * @return {boolean}
     */
    exists(name: string): boolean;
    /**
     * Save a player
     * @fires Player#save
     */
    save(player: unknown): Promise<void>;
    /**
     * @fires Player#saved
     */
    saveAll(): Promise<void>;
    /**
     * @fires Player#updateTick
     */
    tickAll(): void;
    /**
     * Used by Broadcaster
     * @return {Array<Character>}
     */
    getBroadcastTargets(): Array<Character>;
}
import EventEmitter = require("node:events");
import EventManager = require("./EventManager");
import Player = require("./Player");
