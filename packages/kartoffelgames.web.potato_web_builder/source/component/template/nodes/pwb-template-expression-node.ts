import { BasePwbTemplateNode } from './base-pwb-template-node';

export class PwbTemplateExpressionNode extends BasePwbTemplateNode {
    public mExpression: string;

    /**
     * Expression value.
     */
    public get value(): string {
        return this.mExpression;
    } set value(pValue: string) {
        this.mExpression = pValue;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mExpression = '';
    }

    /**
     * Clone current node.
     */
    public clone(): PwbTemplateExpressionNode {
        const lExpressionNodeClone: PwbTemplateExpressionNode = new PwbTemplateExpressionNode();
        lExpressionNodeClone.value = this.value;

        return lExpressionNodeClone;
    }

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    public equals(pBaseNode: PwbTemplateExpressionNode): boolean {
        return pBaseNode instanceof PwbTemplateExpressionNode && pBaseNode.value === this.value;
    }
} 