/**
 * Basic pwb template value used to save node values.
 */
export interface IPwbTemplateValue {
    /**
     * Clone current node.
     */
    clone(): IPwbTemplateValue;

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    equals(pBaseNode: IPwbTemplateValue): boolean;
}