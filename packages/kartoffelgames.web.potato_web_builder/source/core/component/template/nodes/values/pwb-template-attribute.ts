import { PwbTemplateTextNode } from '../pwb-template-text-node.ts';
import { IPwbTemplateValue } from './i-pwb-template-value.interface.ts';

/**
 * Pwb xml template attribute.
 * Saves name and value of a xml attribute. 
 */
export class PwbTemplateAttribute implements IPwbTemplateValue {
    private readonly mName: string;
    private readonly mValue: PwbTemplateTextNode;

    /**
     * Attribute name.
     */
    public get name(): string {
        return this.mName;
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
    public constructor(pName: string) {
        this.mName = pName;
        this.mValue = new PwbTemplateTextNode();
    }

    /**
     * Clone current node.
     */
    public clone(): PwbTemplateAttribute {
        const lCloneNode = new PwbTemplateAttribute(this.name);

        // Deep clone attribute values.
        for (const lValue of this.values.values) {
            // Either add value as string or clone expression node.
            if (typeof lValue === 'string') {
                lCloneNode.values.addValue(lValue);
            } else {
                lCloneNode.values.addValue(lValue.clone());
            }
        }

        return lCloneNode;
    }

    /**
     * Compare current node with another one.
     * 
     * @param pBaseNode - Base pwb template node.
     */
    public equals(pBaseNode: IPwbTemplateValue): boolean {
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