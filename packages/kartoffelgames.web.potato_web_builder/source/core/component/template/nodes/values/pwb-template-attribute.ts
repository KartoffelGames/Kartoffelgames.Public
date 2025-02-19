import { PwbTemplateTextNode } from '../pwb-template-text-node.ts';
import { BasePwbTemplateValue } from './base-pwb-template-value.ts';
import { PwbTemplateExpression } from './pwb-template-expression.ts';

/**
 * Pwb xml template attribute.
 * Saves name and value of a xml attribute. 
 */
export class PwbTemplateAttribute extends BasePwbTemplateValue {
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
    public override clone(): PwbTemplateAttribute {
        const lCloneNode = new PwbTemplateAttribute();
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
     * 
     * @param pBaseNode - Base pwb template node.
     */
    public override equals(pBaseNode: BasePwbTemplateValue): boolean {
        // Check type and name.
        if (!(pBaseNode instanceof PwbTemplateAttribute) || pBaseNode.name !== this.name) {
            return false;
        }

        // Check same count of values.
        if (!pBaseNode.values.equals(this.values)) {
            return false;
        }

        return true;
    }
}