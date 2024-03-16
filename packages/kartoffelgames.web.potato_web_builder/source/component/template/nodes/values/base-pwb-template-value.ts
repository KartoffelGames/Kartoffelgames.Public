import { BasePwbTemplateNode } from '../base-pwb-template-node';

/**
 * Basic node.
 */
export abstract class BasePwbTemplateValue {
    private mNode: BasePwbTemplateNode | null;

    /**
     * Get node of template value.
     */
    public get node(): BasePwbTemplateNode | null {
        return this.mNode;
    } set node(pParent: BasePwbTemplateNode | null) {
        this.mNode = pParent;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mNode = null;
    }

    /**
     * Clone current node.
     */
    public abstract clone(): BasePwbTemplateValue;

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    public abstract equals(pBaseNode: BasePwbTemplateValue): boolean;
}