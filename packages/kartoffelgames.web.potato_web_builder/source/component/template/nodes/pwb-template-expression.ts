import { BasePwbTemplateNode } from './base-pwb-template-node';

export class PwbTemplateExpression extends BasePwbTemplateNode {
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
    public clone(): PwbTemplateExpression {
        const lExpressionNodeClone: PwbTemplateExpression = new PwbTemplateExpression();
        lExpressionNodeClone.value = this.value;

        return lExpressionNodeClone;
    }

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    public equals(pBaseNode: PwbTemplateExpression): boolean {
        return pBaseNode instanceof PwbTemplateExpression && pBaseNode.value === this.value;
    }
} 