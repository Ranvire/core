export = AttributeFactory;
/**
 * @property {Map} attributes
 */
declare class AttributeFactory {
    attributes: Map<string, AttributeDefinition>;
    /**
     * @param {string} name
     * @param {number} base
     * @param {AttributeFormula} formula
     */
    add(name: string, base: number, formula?: AttributeFormula | null, metadata?: Record<string, unknown>): void;
    /**
     * @see Map#has
     */
    has(name: string): boolean;
    /**
     * Get a attribute definition. Use `create` if you want an instance of a attribute
     * @param {string} name
     * @return {object}
     */
    get(name: string): AttributeDefinition | undefined;
    /**
     * @param {string} name
     * @param {number} delta
     * @return {Attribute}
     */
    create(name: string, base?: number | null, delta?: number): Attribute;
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
type AttributeDefinition = {
    name: string;
    base: number;
    formula: AttributeFormula | null;
    metadata: Record<string, unknown>;
};
