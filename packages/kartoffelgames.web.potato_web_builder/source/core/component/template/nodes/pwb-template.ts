import { List } from '@kartoffelgames/core';
import { BasePwbTemplateNode } from './base-pwb-template-node';

/**
 * Pwb template document. Root object of every template.
 */
export class PwbTemplate extends BasePwbTemplateNode {
    private readonly mBodyElementList: List<BasePwbTemplateNode>;

    /**
     * Get all template nodes.
     */
    public get body(): Array<BasePwbTemplateNode> {
        return this.mBodyElementList.clone();
    }

    /**
     * Get template nodes document.
     */
    public override get template(): PwbTemplate {
        return this;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();
        this.mBodyElementList = new List<BasePwbTemplateNode>();
    }

    /**
     * Append child to document body.
     * 
     * @param pNodeList - Template nodes.
     */
    public appendChild(...pNodeList: Array<BasePwbTemplateNode>): void {
        this.mBodyElementList.push(...pNodeList);

        for (const lChildNode of pNodeList) {
            lChildNode.parent = this;
        }
    }

    /**
     * Clonse document with all nodes.
     */
    public clone(): PwbTemplate {
        const lXmlDocument: PwbTemplate = new PwbTemplate();

        // Clone all child nodes.
        for (const lXmlNode of this.mBodyElementList) {
            lXmlDocument.appendChild(lXmlNode.clone());
        }

        return lXmlDocument;
    }

    /**
     * Compare two templates for equality.
     * 
     * @param pBaseNode - Node that should be compared.
     * 
     * @returns true on equality and false otherwise.
     */
    public equals(pBaseNode: BasePwbTemplateNode): boolean {
        // Check type, tagname, namespace and namespace prefix.
        if (!(pBaseNode instanceof PwbTemplate)) {
            return false;
        }

        // Same length
        if (pBaseNode.body.length !== this.body.length) {
            return false;
        }

        // Compare each body element.
        for (let lIndex: number = 0; lIndex < this.body.length; lIndex++) {
            if (!this.body[lIndex].equals(pBaseNode.body[lIndex])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Remove child from template.
     * Return removed child.
     * 
     * @param pNode - Child to remove.
     * 
     * @returns removed child. Undefined when nothing was removed.
     */
    public removeChild(pNode: BasePwbTemplateNode): BasePwbTemplateNode | undefined {
        const lIndex: number = this.mBodyElementList.indexOf(pNode);
        let lRemovedChild: BasePwbTemplateNode | undefined = undefined;

        // If list contains node.
        if (lIndex !== -1) {
            lRemovedChild = this.mBodyElementList.splice(lIndex, 1)[0];

            // If xml node remove parent connection.
            lRemovedChild.parent = null;
        }

        return lRemovedChild;
    }
}