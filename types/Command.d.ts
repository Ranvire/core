export = Command;
/**
 * In game command. See the {@link http://ranviermud.com/extending/commands/|Command guide}
 * @property {string} bundle Bundle this command came from
 * @property {CommandType} type
 * @property {string} name
 * @property {function} func Actual function that gets run when the command is executed
 * @property {Array<string>} aliases
 * @property {string} usage
 * @property {PlayerRoles} requiredRole
 * @property {Object} metadata General use configuration object
 */
declare class Command {
    /**
     * @param {string} bundle Bundle the command came from
     * @param {string} name   Name of the command
     * @param {object} def
     * @param {CommandType} def.type=CommandType.COMMAND
     * @param {function} def.command
     * @param {Array<string>} def.aliases
     * @param {string} def.usage=this.name
     * @param {PlayerRoles} requiredRole=PlayerRoles.PLAYER
     * @param {string} file File the command comes from
     */
    constructor(bundle: string, name: string, def: {
        type: {
            COMMAND: symbol;
            SKILL: symbol;
            CHANNEL: symbol;
            MOVEMENT: symbol;
        };
        command: Function;
        aliases: Array<string>;
        usage: string;
    }, file: string);
    bundle: string;
    type: symbol | {
        COMMAND: symbol;
        SKILL: symbol;
        CHANNEL: symbol;
        MOVEMENT: symbol;
    };
    name: string;
    func: Function;
    aliases: string[];
    usage: string;
    requiredRole: unknown;
    file: string;
    metadata: unknown;
    /**
     * @param {string} args   A string representing anything after the command itself from what the user typed
     * @param {Player} player Player that executed the command
     * @param {string} arg0   The actual command the user typed, useful when checking which alias was used for a command
     * @return {*}
     */
    execute(args: string, player: Player, arg0: string): unknown;
}
import Player = require("./Player");
