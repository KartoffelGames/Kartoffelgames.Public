import { PwbTemplate } from './pwb-template';

/**
 * Basic node.
 */
export abstract class BasePwbTemplateNode {
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
     * Get template nodes document.
     */
    public get template(): PwbTemplate | null {
        return this.parent?.template ?? null;
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
    public abstract clone(): BasePwbTemplateNode;

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    public abstract equals(pBaseNode: BasePwbTemplateNode): boolean;
}