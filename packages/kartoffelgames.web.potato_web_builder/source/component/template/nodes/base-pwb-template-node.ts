import { PwbTemplate } from './pwb-template';
import { PwbTemplateInstructionNode } from './pwb-template-instruction-node';
import { PwbTemplateXmlNode } from './pwb-template-xml-node';

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
            switch (true) {
                case this.mParent instanceof PwbTemplate: this.mParent.removeChild(this); break;
                case this.mParent instanceof PwbTemplateXmlNode: this.mParent.removeChild(this); break;
                case this.mParent instanceof PwbTemplateInstructionNode: this.mParent.removeChild(this); break;
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