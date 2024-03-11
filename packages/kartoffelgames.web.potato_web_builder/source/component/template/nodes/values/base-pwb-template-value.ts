import { BasePwbTemplateNode } from '../base-pwb-template-node';

/**
 * Basic node.
 */
export abstract class BasePwbTemplateValue {
    private mParent: BasePwbTemplateNode | null;

    /**
     * Get Parent of node.
     */
    public get parent(): BasePwbTemplateNode | null {
        return this.mParent;
    } set parent(pParent: BasePwbTemplateNode | null) {
        // If child has already parent.
        if (this.mParent !== null && pParent !== this.mParent) {
            // Remove child from parent based of type.
            if ('removeChild' in this.mParent && typeof this.mParent.removeChild === 'function') {
                this.mParent.removeChild(this);
            }
        }

        this.mParent = pParent;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mParent = null;
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