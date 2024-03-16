import { BasePwbTemplateValue } from './base-pwb-template-value';

export class PwbTemplateExpression extends BasePwbTemplateValue {
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

    /**
     * Read expression as text.
     * 
     * @returns Expression as text. 
     */
    public override toString(): string {
        return `{{ ${this.mExpression} }}`;
    }
} 