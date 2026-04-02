import { Dictionary, List } from '@kartoffelgames/core';
import { BasePwbTemplateNode } from './base-pwb-template-node.ts';
import type { PwbTemplateTextNode } from './pwb-template-text-node.ts';
import { PwbTemplateAttribute } from './values/pwb-template-attribute.ts';

/**
 * Pwb template xml node.
 */
export class PwbTemplateXmlNode extends BasePwbTemplateNode {
    private readonly mAttributeDictionary: Dictionary<string, PwbTemplateAttribute>;
    private readonly mChildList: Array<BasePwbTemplateNode>;
    private mTagName: string;

    /**
     * Get all attributes from xml node.
     */
    public get attributes(): ReadonlyArray<PwbTemplateAttribute> {
        return List.newListWith(...this.mAttributeDictionary.values());
    }

    /**
     * Get childs of xml node list.
     */
    public get childList(): ReadonlyArray<BasePwbTemplateNode> {
        return this.mChildList;
    }

    /**
     * Get tagname.
     */
    public get tagName(): string {
        return this.mTagName;
    } set tagName(pTagName: string) {
        this.mTagName = pTagName;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();
        this.mAttributeDictionary = new Dictionary<string, PwbTemplateAttribute>();
        this.mChildList = Array<BasePwbTemplateNode>();

        this.mTagName = '';
    }

    /**
     * Add child node to node list.
     * 
     * @param pNode - Base node.
     */
    public appendChild(...pNode: Array<BasePwbTemplateNode>): void {
        // Set parent for each child and remove child from previous parent.
        for (const lChild of pNode) {
            lChild.parent = this;
        }

        this.mChildList.push(...pNode);
    }

    /**
     * Clone current node.
     */
    public clone(): PwbTemplateXmlNode {
        const lClonedNode: PwbTemplateXmlNode = new PwbTemplateXmlNode();
        lClonedNode.tagName = this.tagName;

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
    public equals(pBaseNode: BasePwbTemplateNode): boolean {
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
    public removeChild(pNode: BasePwbTemplateNode): BasePwbTemplateNode | undefined {
        const lIndex: number = this.mChildList.indexOf(pNode);

        // If list contains node.
        let lRemovedChild: BasePwbTemplateNode | undefined = undefined;
        if (lIndex !== -1) {
            lRemovedChild = this.mChildList.splice(lIndex, 1)[0];

            // If xml node remove parent connection.
            lRemovedChild.parent = null;
        }

        return lRemovedChild;
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
        const lAttribute: PwbTemplateAttribute = new PwbTemplateAttribute();
        lAttribute.name = pKey;
        lAttribute.node = this;

        this.mAttributeDictionary.set(pKey, lAttribute);

        return lAttribute.values;
    }
}
