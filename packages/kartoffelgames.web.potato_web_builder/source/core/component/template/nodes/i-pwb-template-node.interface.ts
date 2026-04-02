/**
 * Basic pwb template node.
 */
export interface IPwbTemplateNode {
    /**
     * Clone current node.
     */
    clone(): IPwbTemplateNode;

    /**
     * Compare current node with another one.
     * 
     * @param pBaseNode - Base xml node.
     */
    equals(pBaseNode: IPwbTemplateNode): boolean;
}