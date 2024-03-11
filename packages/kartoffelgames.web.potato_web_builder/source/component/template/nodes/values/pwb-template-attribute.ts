import { PwbTemplateTextNode } from '../pwb-template-text-node';
import { BasePwbTemplateValue } from './base-pwb-template-value';
import { PwbTemplateExpression } from './pwb-template-expression';

export class PwbTemplateAttributeNode extends BasePwbTemplateValue {
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
            const lClonedValue: string | PwbTemplateExpression = (typeof lValue === 'string') ? lValue : lValue.clone();
            lCloneNode.values.addValue(lClonedValue);
        }

        return lCloneNode;
    }

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base pwb template node.
     */
    public override equals(pBaseNode: BasePwbTemplateValue): boolean {
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
    values: Array<string | PwbTemplateExpression>;
}; 