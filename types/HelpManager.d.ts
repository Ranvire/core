export = HelpManager;
/**
 * Contain/look up helpfiles
 */
declare class HelpManager {
    helps: Map<string, Helpfile>;
    /**
     * @param {string} help Helpfile name
     */
    get(help: string): Helpfile | undefined;
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
    getFirst(help: string): Helpfile | null;
}
import Helpfile = require("./Helpfile");
type Help = Map<string, Helpfile>;
