import { Exception } from '@kartoffelgames/core.data';

/**
 * Extends {@link Exception} by a {@link ParserException.line} and {@link ParserException.column} field.
 * 
 * @typeParam — T - Exception target type.
 * 
 * @see — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 * 
 * @public
 */
export class ParserException<T> extends Exception<T> {
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
    public constructor(pMessage: string, pTarget: T, pColumnStart: number, pLineStart: number, pColumnEnd: number, pLineEnd: number) {
        super(pMessage, pTarget);

        this.mColumnStart = pColumnStart;
        this.mLineStart = pLineStart;
        this.mColumnEnd = pColumnEnd;
        this.mLineEnd = pLineEnd;
    }
}