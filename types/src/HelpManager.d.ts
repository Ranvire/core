export = HelpManager;
/**
 * Contain/look up helpfiles
 */
declare class HelpManager {
    helps: Map<unknown, unknown>;
    /**
     * @param {string} help Helpfile name
     */
    get(help: string): unknown;
    /**
     * @param {Helpfile} help
     */
    add(help: Helpfile): void;
    /**
     * @param {string} search
     * @return {Help}
     */
    find(search: string): Help;
    /**
     * Returns first help matching keywords
     * @param {string} search
     * @return {?string}
     */
    getFirst(help: unknown): string | null;
}
