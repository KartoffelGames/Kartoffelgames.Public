/**
 * Injection target type hat holds the module value.
 */
export class ModuleValueReference  {
    private readonly mValue: string;

    /**
     * Value.
     */
    public get value(): string {
        return this.mValue;
    }

    /**
     * Constructor.
     * 
     * @param pValue - Module value.
     */
    public constructor(pValue: string) {
        this.mValue = pValue;
    }
 }