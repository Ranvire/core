export = Attributes;
/**
 * Container for a list of attributes for a {@link Character}
 *
 * @extends Map
 */
declare class Attributes extends Map<string, Attribute> {
    constructor();
    constructor(entries?: readonly (readonly [string, Attribute])[]);
    constructor(iterable?: Iterable<readonly [string, Attribute]>);
    /**
     * @param {Attribute} attribute
     */
    add(attribute: Attribute): void;
    /**
     * @return {Iterator} see {@link Map#entries}
     */
    getAttributes(): IterableIterator<[string, Attribute]>;
    /**
     * Clear all deltas for all attributes in the list
     */
    clearDeltas(): void;
    /**
     * Gather data that will be persisted
     * @return {Object}
     */
    serialize(): Record<string, ReturnType<Attribute["serialize"]>>;
}
import { Attribute } from "./Attribute";
