import { IPwbTemplateNode } from './i-pwb-template-node.interface.ts';

/**
 * Pwb template document. Root object of every template.
 */
export class PwbTemplate implements IPwbTemplateNode {
    private readonly mBodyElementList: Array<IPwbTemplateNode>;

    /**
     * Get all template nodes.
     */
    public get body(): ReadonlyArray<IPwbTemplateNode> {
        return this.mBodyElementList;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mBodyElementList = new Array<IPwbTemplateNode>();
    }

    /**
     * Append child to document body.
     * 
     * @param pNodeList - Template nodes.
     */
    public appendChild(...pNodeList: Array<IPwbTemplateNode>): void {
        this.mBodyElementList.push(...pNodeList);
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
    public equals(pBaseNode: IPwbTemplateNode): boolean {
        // Check type, tagname, namespace and namespace prefix.
        if (!(pBaseNode instanceof PwbTemplate)) {
            return false;
        }

        // Same length
        if (pBaseNode.body.length !== this.mBodyElementList.length) {
            return false;
        }

        // Compare each body element.
        for (let lIndex: number = 0; lIndex < this.mBodyElementList.length; lIndex++) {
            if (!this.mBodyElementList[lIndex].equals(pBaseNode.body[lIndex])) {
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
    public removeChild(pNode: IPwbTemplateNode): IPwbTemplateNode | undefined {
        // Search for node index and skip if node is not found.
        const lIndex: number = this.mBodyElementList.indexOf(pNode);
        if (lIndex === -1) {
            return undefined
        }

        // If xml node remove parent connection.
        return this.mBodyElementList.splice(lIndex, 1)[0];
    }
}