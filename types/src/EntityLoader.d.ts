export = EntityLoader;
/**
 * Used to CRUD an entity from a configured DataSource
 */
declare class EntityLoader {
    /**
     * @param {DataSource}
     * @param {object} config
     */
    constructor(dataSource: unknown, config?: object);
    dataSource: unknown;
    config: unknown;
    setArea(name: unknown): void;
    setBundle(name: unknown): void;
    hasData(): unknown;
    fetchAll(): unknown;
    fetch(id: unknown): unknown;
    replace(data: unknown): unknown;
    update(id: unknown, data: unknown): unknown;
}
