import { IPwbTemplateNode } from './i-pwb-template-node.interface.ts';
import type { PwbTemplateTextNode } from './pwb-template-text-node.ts';
import { PwbTemplateAttribute } from './values/pwb-template-attribute.ts';

/**
 * Pwb template xml node.
 */
export class PwbTemplateXmlNode implements IPwbTemplateNode {
    private readonly mAttributeDictionary: Map<string, PwbTemplateAttribute>;
    private readonly mChildList: Array<IPwbTemplateNode>;
    private readonly mTagName: string;

    /**
     * Get all attributes from xml node.
     */
    public get attributes(): ReadonlyArray<PwbTemplateAttribute> {
        return [...this.mAttributeDictionary.values()];
    }

    /**
     * Get childs of xml node list.
     */
    public get childList(): ReadonlyArray<IPwbTemplateNode> {
        return this.mChildList;
    }

    /**
     * Get tagname.
     */
    public get tagName(): string {
        return this.mTagName;
    }

    /**
     * Constructor.
     */
    public constructor(pTagName: string) {
        this.mAttributeDictionary = new Map<string, PwbTemplateAttribute>();
        this.mChildList = Array<IPwbTemplateNode>();

        this.mTagName = pTagName;
    }

    /**
     * Add child node to node list.
     * 
     * @param pNode - Base node.
     */
    public appendChild(...pNode: Array<IPwbTemplateNode>): void {
        this.mChildList.push(...pNode);
    }

    /**
     * Clone current node.
     */
    public clone(): PwbTemplateXmlNode {
        const lClonedNode: PwbTemplateXmlNode = new PwbTemplateXmlNode(this.tagName);

        // Add attributes.
        for (const lAttribute of this.mAttributeDictionary.values()) {
            // Create attribute.
            const lClonedAttribute: PwbTemplateTextNode = lClonedNode.setAttribute(lAttribute.name);

            // Clone each value in new attribute.
            for (const lValue of lAttribute.values.values) {
                // Eighter add attribute value directly as string or clone expression. 
                if (typeof lValue === 'string') {
                    lClonedAttribute.addValue(lValue);
                } else {
                    lClonedAttribute.addValue(lValue.clone());
                }
            }
        }

        // Deep clone every node.
        for (const lNode of this.mChildList) {
            lClonedNode.appendChild(lNode.clone());
        }

        return lClonedNode;
    }

    /**
     * Compare current node with another one.
     * 
     * @param pBaseNode - Base pwb template node.
     */
    public equals(pBaseNode: IPwbTemplateNode): boolean {
        // Check type, tagname.
        if (!(pBaseNode instanceof PwbTemplateXmlNode) || pBaseNode.tagName !== this.tagName) {
            return false;
        }

        // Check same count of attributes.
        if (pBaseNode.attributes.length !== this.mAttributeDictionary.size) {
            return false;
        }

        // Check same count of childs.
        if (pBaseNode.childList.length !== this.mChildList.length) {
            return false;
        }

        // Check all attributes.
        for (const lAttributeOne of pBaseNode.mAttributeDictionary.values()) {
            // This checks also for wrong namespace prefix by checking for qualified attribute name.
            const lAttributeTwo: PwbTemplateAttribute | undefined = this.mAttributeDictionary.get(lAttributeOne.name);

            if (!lAttributeTwo || !lAttributeTwo.equals(lAttributeOne)) {
                return false;
            }
        }

        // Deep check all childnodes
        for (let lIndex: number = 0; lIndex < pBaseNode.childList.length; lIndex++) {
            if (!pBaseNode.childList[lIndex].equals(this.mChildList[lIndex])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Removes attribute and return if attribute was removed/existed.
     * 
     * @param pKey - Key of attribute.
     */
    public removeAttribute(pKey: string): boolean {
        return this.mAttributeDictionary.delete(pKey);
    }

    /**
     * Remove child from XmlNode.
     * Return removed child.
     * 
     * @param pNode - Child to remove.
     */
    public removeChild(pNode: IPwbTemplateNode): IPwbTemplateNode | undefined {
        // Search for node index and skip if node is not found.
        const lIndex: number = this.mChildList.indexOf(pNode);
        if(lIndex === -1) {
            return undefined
        }

        // Remove index from list and return removed child.
        return this.mChildList.splice(lIndex, 1)[0];
    }

    /**
     * Get attribute value of xml node.
     * Returns creates new attribute if it does not exist.
     * 
     * @param pKey - Name of attribute.
     */
    public setAttribute(pKey: string): PwbTemplateTextNode {
        // Read potential attribte.
        if (this.mAttributeDictionary.has(pKey)) {
            return this.mAttributeDictionary.get(pKey)!.values;
        }

        // Create and register new attribute when it does not exists.
        const lAttribute: PwbTemplateAttribute = new PwbTemplateAttribute(pKey);

        this.mAttributeDictionary.set(pKey, lAttribute);

        return lAttribute.values;
    }
}
