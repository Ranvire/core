export = Attributes;
/**
 * Container for a list of attributes for a {@link Character}
 *
 * @extends Map
 */
declare class Attributes extends Map<unknown, unknown> {
    constructor();
    constructor(entries?: readonly (readonly [unknown, unknown])[]);
    constructor();
    constructor(iterable?: Iterable<readonly [unknown, unknown]>);
    /**
     * @param {Attribute} attribute
     */
    add(attribute: Attribute): void;
    /**
     * @return {Iterator} see {@link Map#entries}
     */
    getAttributes(): Iterator<unknown, unknown, unknown>;
    /**
     * Clear all deltas for all attributes in the list
     */
    clearDeltas(): void;
    /**
     * Gather data that will be persisted
     * @return {Object}
     */
    serialize(): unknown;
}
import { Attribute } from "./Attribute";
