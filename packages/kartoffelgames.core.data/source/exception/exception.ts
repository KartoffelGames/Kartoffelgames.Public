/**
 * Extends {@link Error} by a {@link Exception.target} reference.
 * 
 * @typeParam T - Exception target type.
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error}
 * 
 * @public
 */
export class Exception<T> extends Error {
    private readonly mTarget: T;

    /**
     * Target of exception.
     * 
     * @readonly
     */
    public get target(): T {
        return this.mTarget;
    }

    /**
     * Constructor. 
     * @param pMessage - Messsage of exception.
     * @param pTarget - Target of exception.
     */
    public constructor(pMessage: string, pTarget: T) {
        super(pMessage);
        this.mTarget = pTarget;
    }
}