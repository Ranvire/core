/**
 * Representation of a `Character` or container `Item` inventory
 * @extends Map
 */
export class Inventory extends Map<unknown, unknown> {
    /**
     * @param {object} init
     * @param {Array<Item>} init.items
     * @param {number} init.max Max number of items this inventory can hold
     */
    constructor(init: {
        items: Array<Item>;
        max: number;
    });
    maxSize: number;
    /**
     * @param {number} size
     */
    setMax(size: number): void;
    /**
     * @return {number}
     */
    getMax(): number;
    /**
     * @return {boolean}
     */
    get isFull(): boolean;
    /**
     * @param {Item} item
     */
    addItem(item: Item): void;
    /**
     * @param {Item} item
     */
    removeItem(item: Item): void;
    serialize(): {
        items: unknown[];
        max: number;
    };
    /**
     * @param {GameState} state
     * @param {Character|Item} carriedBy
     */
    hydrate(state: GameState, carriedBy: Character | import("./Item")): void;
}
/**
 * @extends Error
 */
export class InventoryFullError extends Error {
}
