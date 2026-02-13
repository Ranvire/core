export = AttributeFactory;
/**
 * @property {Map} attributes
 */
declare class AttributeFactory {
    attributes: Map<unknown, unknown>;
    /**
     * @param {string} name
     * @param {number} base
     * @param {AttributeFormula} formula
     */
    add(name: string, base: number, formula?: AttributeFormula, metadata?: {}): void;
    /**
     * @see Map#has
     */
    has(name: unknown): boolean;
    /**
     * Get a attribute definition. Use `create` if you want an instance of a attribute
     * @param {string} name
     * @return {object}
     */
    get(name: string): object;
    /**
     * @param {string} name
     * @param {number} delta
     * @return {Attribute}
     */
    create(name: string, base?: unknown, delta?: number): Attribute;
    /**
     * Make sure there are no circular dependencies between attributes
     * @throws Error
     */
    validateAttributes(): void;
    /**
     * @private
     * @param {string} attr attribute name to check for circular ref
     * @param {Object.<string, Array<string>>} references
     * @param {Array<string>} stack
     * @return bool
     */
    private _checkReferences;
}
import { AttributeFormula } from "./Attribute";
import { Attribute } from "./Attribute";
