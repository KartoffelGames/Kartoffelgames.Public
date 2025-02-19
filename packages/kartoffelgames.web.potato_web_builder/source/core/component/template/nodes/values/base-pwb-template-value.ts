import { Exception } from '@kartoffelgames/core';
import { BasePwbTemplateNode } from '../base-pwb-template-node.ts';

/**
 * Basic pwb template value used to save node values.
 */
export abstract class BasePwbTemplateValue {
    private mNode: BasePwbTemplateNode | null;

    /**
     * Get node of template value.
     * 
     * @throws {@link Exception}
     * When template value is not attached to any node.
     */
    public get node(): BasePwbTemplateNode {
        if (!this.mNode) {
            throw new Exception('Template value is not attached to any template node.', this);
        }

        return this.mNode;
    } set node(pParent: BasePwbTemplateNode) {
        this.mNode = pParent;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mNode = null;
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