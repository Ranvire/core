export = Config;
/**
 * Access class for the `ranvier.json` config
 */
declare class Config {
    /**
     * @param {string} key
     * @param {*} fallback fallback value
     */
    // Config values are user-defined, so reads remain unknown at the type level.
    static get(key: string, fallback?: unknown): unknown;
    /**
     * Load `ranvier.json` from disk
     */
    static load(data: Record<string, unknown>): void;
}
