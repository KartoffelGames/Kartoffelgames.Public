import { IPwbTemplateNode } from './i-pwb-template-node.interface.ts';
import { PwbTemplateExpression } from './values/pwb-template-expression.ts';

/**
 * Pwb template node only containing text.
 */
export class PwbTemplateTextNode implements IPwbTemplateNode {
    private mContainsExpression: boolean;
    private mTextValue: string;
    private readonly mValues: Array<string | PwbTemplateExpression>;

    /**
     * Text node contains expression.
     */
    public get containsExpression(): boolean {
        return this.mContainsExpression;
    }

    /**
     * Attribute values.
     */
    public get values(): ReadonlyArray<string | PwbTemplateExpression> {
        return this.mValues;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTextValue = '';
        this.mContainsExpression = false;
        this.mValues = [];
    }

    /**
     * Adds new value to attribute.
     * Expression values are linked to this attribute as parent.
     * 
     * @param pValues - String or expression value.
     */
    public addValue(...pValues: Array<string | PwbTemplateExpression>): void {
        // Add each value.
        for (const lValue of pValues) {
            // When value is expression, set contains expression flag.
            if (this.mContainsExpression === true || lValue instanceof PwbTemplateExpression) {
                this.mContainsExpression = true;
            }

            this.mValues.push(lValue);

            // Extends text value.
            this.mTextValue += lValue.toString();
        }
    }

    /**
     * Clone current node.
     */
    public clone(): PwbTemplateTextNode {
        const lCloneNode = new PwbTemplateTextNode();

        // Deep clone attribute values.
        for (const lValue of this.values) {
            // Either clone expression value or add as string value.
            if (typeof lValue === 'string') {
                lCloneNode.addValue(lValue);
            } else {
                lCloneNode.addValue(lValue.clone());
            }
        }

        return lCloneNode;
    }

    /**
     * Compare current node with another one.
     * 
     * @param pBaseNode - Base pwb template node.
     */
    public equals(pBaseNode: IPwbTemplateNode): boolean {
        // Check type.
        if (!(pBaseNode instanceof PwbTemplateTextNode)) {
            return false;
        }

        // Check same count of values.
        if (pBaseNode.values.length !== this.values.length) {
            return false;
        }

        // Check all values.
        for (let lIndex: number = 0; lIndex < this.values.length; lIndex++) {
            const lAttributeOne: string | PwbTemplateExpression | undefined = this.values[lIndex];
            const lAttributeTwo: string | PwbTemplateExpression | undefined = pBaseNode.values[lIndex];

            // Same reference.
            if (lAttributeOne === lAttributeTwo) {
                continue;
            }

            // Same type.
            if (typeof lAttributeOne !== typeof lAttributeTwo) {
                return false;
            }

            // Same string value.
            if (typeof lAttributeOne === 'string' && lAttributeOne !== lAttributeTwo) {
                return false;
            }

            // Both are expression values.
            if (!(<PwbTemplateExpression>lAttributeTwo).equals(<PwbTemplateExpression>lAttributeOne)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get value as pure text.
     * 
     * @returns text node template as text.
     */
    public toString(): string {
        return this.mTextValue;
    }
}