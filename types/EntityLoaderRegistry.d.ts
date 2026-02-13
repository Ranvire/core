export = EntityLoaderRegistry;
/**
 * Holds instances of configured EntityLoaders
 * @type {Map<string, EntityLoader>}
 */
declare class EntityLoaderRegistry extends Map<unknown, unknown> {
    constructor();
    constructor(entries?: readonly (readonly [unknown, unknown])[]);
    constructor();
    constructor(iterable?: Iterable<readonly [unknown, unknown]>);
    load(sourceRegistry: unknown, config?: {}): void;
}
