/**
 * Module attribute reference.
 */
export class ModuleAttribute {
    private readonly mName: string;
    private readonly mValue: string;

    /**
     * Attribute name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Attribute value.
     */
    public get value(): string {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pName - Attribute name
     * @param pValue - Attribute value. 
     */
    public constructor(pName: string, pValue: string) {
        this.mName = pName;
        this.mValue = pValue;
    }
}