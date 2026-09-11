export class LexerToken<TTokenType extends string> {
    // Somehow i know that this will break, so i freeze it to trigger a error when it does.
    private static readonly mEmptyMeta: Array<string> = Object.freeze(new Array<string>()) as Array<string>;

    private readonly mColumnNumber: number;
    private readonly mLineNumber: number;
    private mMetas: Array<string> | null;
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
    public get metas(): ReadonlyArray<string> {
        return this.mMetas ?? LexerToken.mEmptyMeta;
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

        // Create a meta array only when its needed.
        this.mMetas = null;
    }

    /**
     * Add a list of meta values to this token.
     * Duplicate metas are not deduplicated
     *
     * @param pMetaList - Meta values of token.
     */
    public addMeta(pMetaList: Array<string>): void {
        if (pMetaList.length === 0) {
            return;
        }

        // Create storage on first actual meta.
        this.mMetas ??= new Array<string>();

        // Meta lists are tiny, so a linear scan beats a Set.
        this.mMetas.push(...pMetaList);
    }

    /**
     * Validate existence of meta value.
     *
     * @param pMeta - meta value.
     * @returns if this token has the specified meta value.
     */
    public hasMeta(pMeta: string): boolean {
        if (this.mMetas === null) {
            return false;
        }

        return this.mMetas.indexOf(pMeta) !== -1;
    }
}