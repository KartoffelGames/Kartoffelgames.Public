import { Exception } from '@kartoffelgames/core';
import type { LexerToken } from '../lexer/lexer-token.ts';

/**
 * Extends {@link Exception} by a {@link ParserException.line} and {@link ParserException.column} field.
 * 
 * @typeParam T - Exception target type.
 * 
 * @see — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 * 
 * @public
 */
export class ParserException<T> extends Exception<T> {
    /**
     * Creates a ParserException object from a token.
     * 
     * @typeParam T - The type of the target object.
     * @typeParam TTokenType - The type of the token.
     * 
     * @param pMessage - The error message.
     * @param pTarget - The target object.
     * @param pStartToken - The start token.
     * @param pEndToken - The end token.
     * 
     * @returns A new ParserException object.
     */
    public static fromToken<T, TTokenType extends string>(pCause: any, pTarget: T, pStartToken: LexerToken<TTokenType> | null, pEndToken: LexerToken<TTokenType> | null): ParserException<T> {
        // Save actual error as error option.
        let lMessage: string;
        let lErrorOptions: ErrorOptions | undefined;
        if (pCause instanceof Error) {
            lMessage = pCause.message;
            lErrorOptions = { cause: pCause };
        } else {
            lMessage = pCause.toString();
            lErrorOptions = undefined;
        }

        // No start token means there is also no endtoken.
        if (!pStartToken || !pEndToken) {
            return new ParserException(lMessage, pTarget, 1, 1, 1, 1, lErrorOptions);
        }

        const lEndTokenLines = pEndToken.value.split('\n');

        // Extends the end token line end.
        const lLineEnd: number = pEndToken.lineNumber + lEndTokenLines.length - 1;

        // Set column end based on, if the token is multiline or not.
        let lColumnEnd: number = (lEndTokenLines.length > 1) ? 1 : pEndToken.columnNumber;
        lColumnEnd += lEndTokenLines.at(-1)!.length;

        return new ParserException(lMessage, pTarget, pStartToken.columnNumber, pStartToken.lineNumber, lColumnEnd, lLineEnd, lErrorOptions);
    }

    private readonly mColumnEnd: number;
    private readonly mColumnStart: number;
    private readonly mLineEnd: number;
    private readonly mLineStart: number;

    /**
     * Column number of target text where the exception ended.
     */
    public get columnEnd(): number {
        return this.mColumnEnd;
    }

    /**
     * Column number of target text where the exception started.
     */
    public get columnStart(): number {
        return this.mColumnStart;
    }

    /**
     * Line number of target text where the exception ended.
     */
    public get lineEnd(): number {
        return this.mLineEnd;
    }

    /**
     * Line number of target text where the exception started.
     */
    public get lineStart(): number {
        return this.mLineStart;
    }

    /**
     * Constructor.
     * 
     * @param pMessage - Messsage of exception.
     * @param pTarget - Target of exception.
     * @param pColumn - Column number of target parser text.
     * @param pLine - Line number of target parser text.
     */
    public constructor(pMessage: string, pTarget: T, pColumnStart: number, pLineStart: number, pColumnEnd: number, pLineEnd: number, pErrorOptions?: ErrorOptions) {
        super(pMessage, pTarget, pErrorOptions);

        this.mColumnStart = pColumnStart;
        this.mLineStart = pLineStart;
        this.mColumnEnd = pColumnEnd;
        this.mLineEnd = pLineEnd;
    }
}