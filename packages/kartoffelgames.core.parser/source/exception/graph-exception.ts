import { Exception } from '@kartoffelgames/core';
import { LexerToken } from '../lexer/lexer-token.ts';

/**
 * Exception exclusive to graph errors.
 * 
 * @internal
 */
export class GraphException<TTokenType extends string> extends Error {
    private readonly mErrorList: Array<GraphParseError<TTokenType>>;

    /**
     * Get error count of exception.
     */
    public get errorCount(): number {
        return this.mErrorList.length;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Graph Error');

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
     * Merge errors from set execption into current.
     * Append error list at the end.
     * 
     * @param pException - Graph exception.
     */
    public merge(pException: GraphException<TTokenType>): void {
        this.mErrorList.push(...pException.mErrorList);
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

            // Skip errors without tokens.
            if (!lError.errorToken) {
                continue;
            }

            // Calculate priority
            const lCurrentPriority: number = (lErrorPosition.errorToken.lineNumber * 10000) + lErrorPosition.errorToken.columnNumber;
            const lNewPriority: number = (lError.errorToken.lineNumber * 10000) + lError.errorToken.columnNumber;

            // Error token exists and is at least position.
            if (lCurrentPriority < lNewPriority) {
                lErrorPosition = lError;
            }
        }

        // At lease one error must be found.
        if (!lErrorPosition) {
            throw new Exception('No error attached to graph exception.', this);
        }

        return lErrorPosition;
    }

    /**
     * Executes callback action. 
     * When the action throws an {@link GraphException} the exception will be catched and any error within will be merged into this exception.
     * Any other error beside {@link GraphException}s are thrown normaly.
     * 
     * @param pAction - Action.
     */
    public onErrorMergeAndContinue(pAction: () => void): void {
        try {
            pAction();
        } catch (pException) {
            // Only handle exclusive graph errors.
            if (!(pException instanceof GraphException)) {
                throw pException;
            }

            // When unsuccessfull save the last error.
            this.merge(pException);
        }
    }
}

export type GraphParseError<TTokenType extends string> = {
    message: string;
    errorToken: LexerToken<TTokenType> | undefined;
};