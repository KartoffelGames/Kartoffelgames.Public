export class LexerToken<TTokenType extends string> {
    private readonly mColumnNumber: number;
    private readonly mLineNumber: number;
    private readonly mTypes: Set<TTokenType>;
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
     * All asigned token types of token.
     */
    public get types(): Array<TTokenType> {
        return [...this.mTypes];
    }

    /**
     * Value of token.
     */
    public get value(): string {
        return this.mValue;
    }

    public constructor(pValue: string, pColumnNumber: number, pLineNumber: number) {
        this.mValue = pValue;
        this.mColumnNumber = pColumnNumber;
        this.mLineNumber = pLineNumber;

        this.mTypes = new Set<TTokenType>();
    }

    /**
     * Add a type to this token.
     * Dublicate types are overriden.
     * 
     * @param pTypeList - Types of token.
     */
    public addType(...pTypeList: Array<TTokenType>): void {
        for (const lType of pTypeList) {
            this.mTypes.add(lType);
        }
    }

    /**
     * Validate existance of token type.
     * 
     * @param pType - Token type.
     * @returns if this token has the specified token type.
     */
    public hasType(pType: TTokenType): boolean {
        return this.mTypes.has(pType);
    }
}