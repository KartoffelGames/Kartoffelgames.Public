import { BasePwbTemplateNode } from './base-pwb-template-node';

/**
 * Node only contains text.
 */
export class PwbTemplateTextNode extends BasePwbTemplateNode {
    private mText: string;

    /**
     * Get text string of node.
     */
    public get text(): string {
        return this.mText;
    }

    /**
     * Set text string of node.
     * @param pText - Text of node.
     */
    public set text(pText: string) {
        this.mText = pText;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();
        this.mText = '';
    }

    /**
     * Clone current node.
     */
    public clone(): PwbTemplateTextNode {
        const lTextNodeClone: PwbTemplateTextNode = new PwbTemplateTextNode();
        lTextNodeClone.text = this.text;

        return lTextNodeClone;
    }

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    public equals(pBaseNode: PwbTemplateTextNode): boolean {
        return pBaseNode instanceof PwbTemplateTextNode && pBaseNode.text === this.text;
    }
}