export = DataSourceRegistry;
/**
 * Holds instances of configured DataSources
 * @type {Map<string, DataSource>}
 */
declare class DataSourceRegistry extends Map<string, DataSource> {
    constructor();
    constructor(entries?: readonly (readonly [string, DataSource])[]);
    constructor(iterable?: Iterable<readonly [string, DataSource]>);
    /**
     * @param {Function} requireFn used to require() the loader
     * @param {string} rootPath project root
     * @param {object} config configuration to load
     */
    load(requireFn: (moduleName: string) => unknown, rootPath: string, config?: Record<string, DataSourceLoaderConfig>): void;
}
type DataSource = {
    name: string;
    hasData(...args: unknown[]): boolean | Promise<boolean>;
    // Data source implementations can expose extra provider-specific methods.
    [key: string]: unknown;
};
type DataSourceLoaderConfig = {
    require: string;
    config?: Record<string, unknown>;
    // Data source loader configs may carry provider-specific settings.
    [key: string]: unknown;
};
