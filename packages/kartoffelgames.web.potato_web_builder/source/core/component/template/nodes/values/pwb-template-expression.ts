import { IPwbTemplateValue } from './i-pwb-template-value.interface.ts';

/**
 * Pwb template expression.
 * 
 * @remarks
 * Expects expressions to be stripped of double brackets.
 * The string output is modified to expect this.
 */
export class PwbTemplateExpression implements IPwbTemplateValue {
    public readonly mExpression: string;

    /**
     * Expression value.
     */
    public get value(): string {
        return this.mExpression;
    }

    /**
     * Constructor.
     * 
     * @param pExpression - Expression as string. Expression should be stripped of double brackets.
     */
    public constructor(pExpression: string) {
        this.mExpression = pExpression;
    }

    /**
     * Clone current node.
     */
    public clone(): PwbTemplateExpression {
        return new PwbTemplateExpression(this.mExpression);
    }

    /**
     * Compare current node with another one.
     * 
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
    public toString(): string {
        return `{{ ${this.mExpression} }}`;
    }
} 