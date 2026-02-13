export = DataSourceRegistry;
/**
 * Holds instances of configured DataSources
 * @type {Map<string, DataSource>}
 */
declare class DataSourceRegistry extends Map<unknown, unknown> {
    constructor();
    constructor(entries?: readonly (readonly [unknown, unknown])[]);
    constructor();
    constructor(iterable?: Iterable<readonly [unknown, unknown]>);
    /**
     * @param {Function} requireFn used to require() the loader
     * @param {string} rootPath project root
     * @param {object} config configuration to load
     */
    load(requireFn: Function, rootPath: string, config?: object): void;
}
