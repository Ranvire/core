export = Helpfile;
/**
 * Representation of an in game helpfile
 */
declare class Helpfile {
    /**
     * @param {string} bundle Bundle the helpfile comes from
     * @param {string} name
     * @param {object} options
     * @param {Array<string>} [options.keywords]
     * @param {string} [options.command]
     * @param {string} [options.channel]
     * @param {Array<string>} [options.related]
     * @param {string} options.body
     */
    constructor(bundle: string, name: string, options: {
        keywords?: Array<string>;
        command?: string;
        channel?: string;
        related?: Array<string>;
        body: string;
    });
    bundle: string;
    name: string;
    keywords: string[];
    command: string;
    channel: string;
    related: string[];
    body: string;
}
