import { BasePwbTemplateNode } from './base-pwb-template-node';
import { PwbTemplateExpression } from './values/pwb-template-expression';

/**
 * Pwb template node only containing text.
 */
export class PwbTemplateTextNode extends BasePwbTemplateNode {
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
    public get values(): Array<string | PwbTemplateExpression> {
        return this.mValues;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

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
            // Link expression parent to this attribute. 
            if (lValue instanceof PwbTemplateExpression) {
                lValue.node = this;

                // Set contains expression flag.
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
    public override clone(): PwbTemplateTextNode {
        const lCloneNode = new PwbTemplateTextNode();

        // Deep clone attribute values.
        for (const lValue of this.values) {
            const lClonedValue: string | PwbTemplateExpression = (typeof lValue === 'string') ? lValue : lValue.clone();
            lCloneNode.addValue(lClonedValue);
        }

        return lCloneNode;
    }

    /**
     * Compare current node with another one.
     * 
     * @param pBaseNode - Base pwb template node.
     */
    public override equals(pBaseNode: BasePwbTemplateNode): boolean {
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
    public override toString(): string {
        return this.mTextValue;
    }
}