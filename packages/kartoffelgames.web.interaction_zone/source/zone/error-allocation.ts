import { InteractionZone} from './interaction-zone';

/**
 * Allocates current error to its interaction zone.
 */
export class ErrorAllocation {
    private static readonly mAsyncronErrorZones: WeakMap<Promise<unknown>, InteractionZone> = new WeakMap<Promise<unknown>, InteractionZone>();
    private static readonly mSynchronErrorZones: WeakMap<object, InteractionZone> = new WeakMap<object, InteractionZone>();


    /**
     * Allocate error with interaction zone.
     * 
     * @param pError - Error data.
     * @param pZone - Zone of error.
     */
    public static allocateAsyncronError<T>(pPromise: Promise<T>, pZone: InteractionZone): void {
        ErrorAllocation.mAsyncronErrorZones.set(pPromise, pZone);
    }

    /**
     * Allocate error with interaction zone.
     * 
     * @param pError - Error data.
     * @param pZone - Zone of error.
     */
    public static allocateSyncronError(pError: any, pZone: InteractionZone): object {
        // Create error object of error when error is not a object.
        const lError: object = (typeof pError === 'object' && pError !== null) ? pError : new Error(pError);

        // Allocate error to stack.
        ErrorAllocation.mSynchronErrorZones.set(lError, pZone);

        return lError;
    }

    /**
     * Get interaction zone in which the {@link Promise} was created.
     * 
     * @param pPromise - {@link Promise}.
     * 
     * @returns interaction zone where the of {@link Promise} was created or undefined when the promise was constructed outside any zone.s 
     */
    public static getAsyncronErrorZone<T>(pPromise: Promise<T>): InteractionZone | undefined {
        return ErrorAllocation.mAsyncronErrorZones.get(pPromise);
    }

    /**
     * Get interaction zone of syncron error.
     * 
     * @param pError - Error.
     */
    public static getSyncronErrorZone(pError: object): InteractionZone | undefined {
        return ErrorAllocation.mSynchronErrorZones.get(pError);
    }
}