export = Config;
/**
 * Access class for the `ranvier.json` config
 */
declare class Config {
    /**
     * @param {string} key
     * @param {*} fallback fallback value
     */
    static get<T>(key: string, fallback: T): T;
    static get(key: string): unknown;
    /**
     * Load `ranvier.json` from disk
     */
    static load(data: Record<string, unknown>): void;
}
