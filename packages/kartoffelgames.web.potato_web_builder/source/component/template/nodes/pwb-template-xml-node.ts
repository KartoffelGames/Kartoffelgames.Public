import { Dictionary, List } from '@kartoffelgames/core.data';
import { BasePwbTemplateNode } from './base-pwb-template-node';

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
    public get attributes(): Array<PwbTemplateAttribute> {
        return List.newListWith(...this.mAttributeDictionary.values());
    }

    /**
     * Get childs of xml node list.
     */
    public get childList(): Array<BasePwbTemplateNode> {
        return List.newListWith(...this.mChildList);
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
        for (const lAttribute of this.attributes) {
            lClonedNode.setAttribute(
                lAttribute.name,
                lAttribute.value
            );
        }

        // Deep clone every node.
        for (const lNode of this.mChildList) {
            lClonedNode.appendChild(lNode.clone());
        }

        return lClonedNode;
    }

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base pwb template node.
     */
    public equals(pBaseNode: PwbTemplateXmlNode): boolean {
        // Check type, tagname.
        if (!(pBaseNode instanceof PwbTemplateXmlNode) || pBaseNode.tagName !== this.tagName) {
            return false;
        }

        // Check same count of attributes.
        if (pBaseNode.attributes.length !== this.attributes.length) {
            return false;
        }

        // Check all attributes.
        for (const lAttribute of pBaseNode.mAttributeDictionary.values()) {
            // This checks also for wrong namespace prefix by checking for qualified attribute name.
            const lAttributeTwo: PwbTemplateAttribute | undefined = this.mAttributeDictionary.get(lAttribute.name);

            if (!lAttributeTwo || lAttributeTwo.value !== lAttribute.value) {
                return false;
            }
        }

        // Check same count of childs.
        if (pBaseNode.childList.length !== this.childList.length) {
            return false;
        }

        // Deep check all childnodes
        for (let lIndex: number = 0; lIndex < pBaseNode.childList.length; lIndex++) {
            if (!pBaseNode.childList[lIndex].equals(this.childList[lIndex])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get attribute value of xml node.
     * Returns null if attribute does not exist.
     * @param pKey - Name of attribute.
     */
    public getAttribute(pKey: string): string | undefined {
        return this.mAttributeDictionary.get(pKey)?.value;
    }

    /**
     * Removes attribute and return if attribute was removed/existed.
     * @param pKey - Key of attribute.
     */
    public removeAttribute(pKey: string): boolean {
        if (this.mAttributeDictionary.has(pKey)) {
            this.mAttributeDictionary.delete(pKey);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Remove child from XmlNode.
     * Return removed child.
     * @param pNode - Child to remove.
     */
    public removeChild(pNode: BasePwbTemplateNode): BasePwbTemplateNode | undefined {
        const lIndex: number = this.mChildList.indexOf(pNode);
        let lRemovedChild: BasePwbTemplateNode | undefined = undefined;

        // If list contains node.
        if (lIndex !== -1) {
            lRemovedChild = this.mChildList.splice(lIndex, 1)[0];

            // If xml node remove parent connection.
            lRemovedChild.parent = null;
        }

        return lRemovedChild;
    }

    /**
     * Set and get Attribute of xml node. Creates new one if attribute does not exist.
     * @param pKey - Key of attribute.
     * @param pValue - Name of attribute.
     */
    public setAttribute(pKey: string, pValue: string): void {
        // Init complete attribute when it does not exists.
        if (!this.mAttributeDictionary.has(pKey)) {
            this.mAttributeDictionary.set(pKey, { name: pKey, value: pValue });
        } else {
            this.mAttributeDictionary.get(pKey)!.value = pValue;
        }
    }
}


export type PwbTemplateAttribute = {
    name: string;
    value: string;
}; 