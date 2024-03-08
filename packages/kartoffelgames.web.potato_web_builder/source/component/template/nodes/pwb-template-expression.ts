export class PwbTemplateExpression {
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
        this.mExpression = '';
    }
} 