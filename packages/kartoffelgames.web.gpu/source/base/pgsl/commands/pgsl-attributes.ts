import { Dictionary, Exception } from '@kartoffelgames/core.data';

export class PgslAttributes {
    private readonly mAttributes: Dictionary<string, Array<number | string>>;

    /**
     * All available attribute names.
     */
    public get names(): Array<string> {
        return [...this.mAttributes.keys()];
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mAttributes = new Dictionary<string, Array<number | string>>();
    }

    /**
     * Add attribute with parameter.
     * @param pName - Name of attribute.
     * @param pParameters - Attribute parameters.
     */
    public add(pName: string, ...pParameters: Array<string | number>): void {
        // Prevent dublicate attribute.
        if (this.mAttributes.has(pName)) {
            throw new Exception(`Dublicate attribute "${pName}"`, this);
        }

        // Add attribute.
        this.mAttributes.set(pName, pParameters);
    }

    /**
     * Get parameters of attribute.
     * @param pName - Name of attribute.
     */
    public getParametersOf(pName: string): Array<number | string> {
        // Prevent dublicate attribute.
        if (!this.mAttributes.has(pName)) {
            throw new Exception(`Missing attribute "${pName}"`, this);
        }

        return [...this.mAttributes.get(pName)!];
    }

    /**
     * Check for attribute.
     * @param pName - Name of attribute.
     */
    public has(pName: string): boolean {
        return this.mAttributes.has(pName);
    }
}