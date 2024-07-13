/**
 * Module expression reference.
 */
export class ModuleExpression {
    private readonly mValue: string;

    /**
     * Expression value.
     */
    public get value(): string {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pValue - Attribute value. 
     */
    public constructor(pValue: string) {
        this.mValue = pValue;
    }
}