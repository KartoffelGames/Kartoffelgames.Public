/**
 * Injection target type hat holds the module key.
 */
export class ModuleKeyReference  {
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
     * @param pValue - Module key value.
     */
    public constructor(pValue: string) {
        this.mValue = pValue;
    }
 }