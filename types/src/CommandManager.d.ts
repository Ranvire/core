export = CommandManager;
/**
 * Contains all active in game commands
 */
declare class CommandManager {
    commands: Map<unknown, unknown>;
    /**
     * Get command by name
     * @param {string}
     * @return {Command}
     */
    get(command: unknown): Command;
    /**
     * Add the command and set up aliases
     * @param {Command}
     */
    add(command: unknown): void;
    /**
     * @param {Command}
     */
    remove(command: unknown): void;
    /**
     * Find a command from a partial name
     * @param {string} search
     * @param {boolean} returnAlias true to also return which alias of the command was used
     * @return {Command}
     */
    find(search: string, returnAlias: boolean): Command;
}
