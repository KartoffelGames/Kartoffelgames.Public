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
    private readonly mColumnNumber: number;
    private readonly mLineNumber: number;

    /**
     * Column number of target text where the exception occurred.
     */
    public get column(): number {
        return this.mColumnNumber;
    }

    /**
     * Line number of target text where the exception occurred.
     */
    public get line(): number {
        return this.mLineNumber;
    }
    
    /**
     * Constructor.
     * 
     * @param pMessage - Messsage of exception.
     * @param pTarget - Target of exception.
     * @param pColumn - Column number of target parser text.
     * @param pLine - Line number of target parser text.
     */
    public constructor(pMessage: string, pTarget: T, pColumn: number, pLine: number) {
        super(pMessage, pTarget);

        this.mColumnNumber = pColumn;
        this.mLineNumber = pLine;
    }
}