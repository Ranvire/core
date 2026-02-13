export = Config;
/**
 * Access class for the `ranvier.json` config
 */
declare class Config {
    /**
     * @param {string} key
     * @param {*} fallback fallback value
     */
    static get(key: string, fallback: unknown): unknown;
    /**
     * Load `ranvier.json` from disk
     */
    static load(data: unknown): void;
}
