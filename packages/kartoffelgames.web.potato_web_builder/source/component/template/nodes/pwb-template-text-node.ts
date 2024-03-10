import { BasePwbTemplateNode } from './base-pwb-template-node';
import { PwbTemplateExpressionNode } from './pwb-template-expression-node';

/**
 * Node only contains text.
 */
export class PwbTemplateTextNode extends BasePwbTemplateNode {
    private readonly mValues: Array<string | PwbTemplateExpressionNode>;

    /**
     * Attribute values.
     */
    public get values(): Array<string | PwbTemplateExpressionNode> {
        return this.mValues;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();
        this.mValues = [];
    }

    /**
     * Adds new value to attribute.
     * Expression values are linked to this attribute as parent.
     * 
     * @param pValue - String or expression value.
     */
    public addValue(pValue: string | PwbTemplateExpressionNode): void {
        // Link expression parent to this attribute. 
        if (pValue instanceof PwbTemplateExpressionNode) {
            pValue.parent = this;
        }

        this.mValues.push(pValue);
    }

    /**
     * Clone current node.
     */
    public override clone(): PwbTemplateTextNode {
        const lCloneNode = new PwbTemplateTextNode();

        // Deep clone attribute values.
        for (const lValue of this.values) {
            const lClonedValue: string | PwbTemplateExpressionNode = (typeof lValue === 'string') ? lValue : lValue.clone();
            lCloneNode.addValue(lClonedValue);
        }

        return lCloneNode;
    }

    /**
     * Compare current node with another one.
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
            const lAttributeOne: string | PwbTemplateExpressionNode | undefined = this.values[lIndex];
            const lAttributeTwo: string | PwbTemplateExpressionNode | undefined = pBaseNode.values[lIndex];

            // Same type.
            if (typeof lAttributeOne !== typeof lAttributeTwo) {
                return false;
            }

            // Same reference.
            if (lAttributeOne === lAttributeTwo) {
                continue;
            }

            // Same string value.
            if (typeof lAttributeOne === 'string' && lAttributeOne !== lAttributeTwo) {
                return false;
            } else {
                // Both are expression values.
                if (!(<PwbTemplateExpressionNode>lAttributeTwo).equals(<PwbTemplateExpressionNode>lAttributeOne)) {
                    return false;
                }
            }
        }

        return true;
    }
}