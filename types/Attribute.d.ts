/**
 * Representation of an "Attribute" which is unknown value that has a base amount and depleted/restored
 * safely. Where safely means without being destructive to the base value.
 *
 * An attribute on its own cannot be raised above its base value. To raise attributes above their
 * base temporarily see the {@link http://ranviermud.com/extending/effects|Effect guide}.
 *
 * @property {string} name
 * @property {number} base
 * @property {number} delta Current difference from the base
 * @property {AttributeFormula} formula
 * @property {object} metadata unknown custom info for this attribute
 */
export class Attribute {
    /**
     * @param {string} name
     * @param {number} base
     * @param {number} delta=0
     * @param {AttributeFormula} formula=null
     * @param {object} metadata={}
     */
    constructor(name: string, base: number, delta?: number, formula?: AttributeFormula | null, metadata?: Record<string, unknown>);
    name: string;
    base: number;
    delta: number;
    formula: AttributeFormula | null;
    metadata: Record<string, unknown>;
    /**
     * Lower current value
     * @param {number} amount
     */
    lower(amount: number): void;
    /**
     * Raise current value
     * @param {number} amount
     */
    raise(amount: number): void;
    /**
     * Change the base value
     * @param {number} amount
     */
    setBase(amount: number): void;
    /**
     * Bypass raise/lower, directly setting the delta
     * @param {amount}
     */
    setDelta(amount: number): void;
    serialize(): {
        delta: number;
        base: number;
    };
}
/**
 * @property {Array<string>} requires Array of attributes required for this formula to run
 * @property {function (...number) : number} formula
 */
export class AttributeFormula {
    constructor(requires: string[], fn: (this: Attribute, ...args: number[]) => number);
    requires: string[];
    formula: (this: Attribute, ...args: number[]) => number;
    evaluate(attribute: Attribute, ...args: number[]): number;
}
