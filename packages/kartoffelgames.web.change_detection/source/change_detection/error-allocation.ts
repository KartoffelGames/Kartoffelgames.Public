import { InteractionZoneStack } from './interaction-zone';

/**
 * Allocates current error to its interaction zone.
 */
export class ErrorAllocation {
    private static readonly mAsyncronErrorZoneStacks: WeakMap<Promise<unknown>, InteractionZoneStack> = new WeakMap<Promise<unknown>, InteractionZoneStack>();
    private static readonly mSynchronErrorZoneStacks: WeakMap<object, InteractionZoneStack> = new WeakMap<object, InteractionZoneStack>();


    /**
     * Allocate error with interaction zone.
     * 
     * @param pError - Error data.
     * @param pZone - Zone of error.
     */
    public static allocateAsyncronError<T>(pPromise: Promise<T>, pZoneStack: InteractionZoneStack): void {
        ErrorAllocation.mAsyncronErrorZoneStacks.set(pPromise, pZoneStack);
    }

    /**
     * Allocate error with interaction zone.
     * 
     * @param pError - Error data.
     * @param pZone - Zone of error.
     */
    public static allocateSyncronError(pError: any, pZoneStack: InteractionZoneStack): object {
        // Create error object of error when error is not a object.
        const lError: object = (typeof pError === 'object' && pError !== null) ? pError : new Error(pError);

        // Prevent error relocation.
        if (ErrorAllocation.mSynchronErrorZoneStacks.has(lError)) {
            return lError;
        }

        // Allocate error to stack.
        ErrorAllocation.mSynchronErrorZoneStacks.set(lError, pZoneStack);

        return lError;
    }

    /**
     * Get interaction zone stack in which the {@link Promise} was created.
     * 
     * @param pPromise - {@link Promise}.
     * 
     * @returns interaction zone where the of {@link Promise} was created or undefined when the promise was constructed outside any zone.s 
     */
    public static getAsyncronErrorZoneStack<T>(pPromise: Promise<T>): InteractionZoneStack | undefined {
        return ErrorAllocation.mAsyncronErrorZoneStacks.get(pPromise);
    }

    /**
     * Get interaction zone stack of syncron error.
     * 
     * @param pError - Error.
     */
    public static getSyncronErrorZoneStack(pError: object): InteractionZoneStack | undefined {
        return ErrorAllocation.mSynchronErrorZoneStacks.get(pError);
    }
}