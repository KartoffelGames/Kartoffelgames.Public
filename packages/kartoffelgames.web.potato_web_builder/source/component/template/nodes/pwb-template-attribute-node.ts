import { BasePwbTemplateNode } from './base-pwb-template-node';
import { PwbTemplateExpressionNode } from './pwb-template-expression-node';
import { PwbTemplateTextNode } from './pwb-template-text-node';

export class PwbTemplateAttributeNode extends BasePwbTemplateNode {
    private mName: string;
    private readonly mValue: PwbTemplateTextNode;

    /**
     * Attribute name.
     */
    public get name(): string {
        return this.mName;
    } set name(pValue: string) {
        this.mName = pValue;
    }

    /**
     * Attribute value.
     */
    public get values(): PwbTemplateTextNode {
        return this.mValue;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mName = '';
        this.mValue = new PwbTemplateTextNode();
    }

    /**
     * Clone current node.
     */
    public override clone(): PwbTemplateAttributeNode {
        const lCloneNode = new PwbTemplateAttributeNode();
        lCloneNode.name = this.name;

        // Deep clone attribute values.
        for (const lValue of this.values.values) {
            const lClonedValue: string | PwbTemplateExpressionNode = (typeof lValue === 'string') ? lValue : lValue.clone();
            lCloneNode.values.addValue(lClonedValue);
        }

        return lCloneNode;
    }

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base pwb template node.
     */
    public override equals(pBaseNode: BasePwbTemplateNode): boolean {
        // Check type and name.
        if (!(pBaseNode instanceof PwbTemplateAttributeNode) || pBaseNode.name !== this.name) {
            return false;
        }

        // Check same count of values.
        if (!pBaseNode.values.equals(this.values)) {
            return false;
        }

        return true;
    }
}

export type PwbTemplateAttribute = {
    name: string;
    values: Array<string | PwbTemplateExpressionNode>;
}; 