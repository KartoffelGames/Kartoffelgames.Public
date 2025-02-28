export class LexerToken<TTokenType extends string> {
    private readonly mColumnNumber: number;
    private readonly mLineNumber: number;
    private readonly mMetas: Set<string>;
    private readonly mType: TTokenType;
    private readonly mValue: string;

    /**
     * Column number of token appearance.
     */
    public get columnNumber(): number {
        return this.mColumnNumber;
    }

    /**
     * Line number of token appearance.
     */
    public get lineNumber(): number {
        return this.mLineNumber;
    }

    /**
     * All asigned meta values of token.
     */
    public get metas(): Array<string> {
        return [...this.mMetas];
    }

    /**
     * All asigned token type of token.
     */
    public get type(): TTokenType {
        return this.mType;
    }

    /**
     * Value of token.
     */
    public get value(): string {
        return this.mValue;
    }

    public constructor(pType: TTokenType, pValue: string, pColumnNumber: number, pLineNumber: number) {
        this.mValue = pValue;
        this.mColumnNumber = pColumnNumber;
        this.mLineNumber = pLineNumber;
        this.mType = pType;

        this.mMetas = new Set<string>();
    }

    /**
     * Add a meta value to this token.
     * Dublicate metas are overriden.
     * 
     * @param pMetaList - Meta values of token.
     */
    public addMeta(...pMetaList: Array<string>): void {
        for (const lType of pMetaList) {
            this.mMetas.add(lType);
        }
    }

    /**
     * Validate existence of meta value.
     * 
     * @param pMeta - meta value.
     * @returns if this token has the specified meta value.
     */
    public hasMeta(pMeta: string): boolean {
        return this.mMetas.has(pMeta);
    }
}