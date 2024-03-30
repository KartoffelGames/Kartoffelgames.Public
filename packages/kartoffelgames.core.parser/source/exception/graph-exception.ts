import { LexerToken } from '../lexer/lexer-token';

/**
 * Exception exclusive to grapth errors.
 * 
 * @internal
 */
export class GrapthException<TTokenType extends string> extends Error {
    private readonly mErrorList: Array<GraphParseError<TTokenType>>;

    /**
     * Error count.
     */
    public get errorCount(): number {
        return this.mErrorList.length;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Grapth Error');

        this.mErrorList = new Array<GraphParseError<TTokenType>>();
    }

    /**
     * Add error token to exception.
     * 
     * @param pMessage - Error message.
     * @param pErrorToken - Error token.
     */
    public appendError(pMessage: string, pErrorToken: LexerToken<TTokenType> | undefined): void {
        this.mErrorList.push({
            message: pMessage,
            errorToken: pErrorToken
        });
    }

    /**
     * Read the error with the least token position. 
     * 
     * @returns most relevant error.
     */
    public mostRelevant(): GraphParseError<TTokenType> {
        // Find error with the latest error position.
        let lErrorPosition: GraphParseError<TTokenType> | null = null;
        for (const lError of this.mErrorList) {
            // No previous token.
            if (!lErrorPosition?.errorToken) {
                lErrorPosition = lError;
                continue;
            }

            // Error token exists and is at least position.
            if (lError.errorToken && (lError.errorToken.lineNumber > lErrorPosition.errorToken.lineNumber || lError.errorToken.lineNumber === lErrorPosition.errorToken.lineNumber && lError.errorToken.columnNumber > lErrorPosition.errorToken.columnNumber)) {
                lErrorPosition = lError;
            }
        }

        // At lease one error must be found.
        return lErrorPosition!;
    }
}

export type GraphParseError<TTokenType extends string> = {
    message: string;
    errorToken: LexerToken<TTokenType> | undefined;
};