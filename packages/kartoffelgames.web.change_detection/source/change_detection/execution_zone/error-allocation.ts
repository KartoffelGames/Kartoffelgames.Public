import { InteractionZone } from '../interaction-zone';

/**
 * Allocates current error to its interaction zone.
 */
export class ErrorAllocation {
    private static mError: any;
    private static mZone: InteractionZone;

    /**
     * Allocate error with interaction zone.
     * 
     * @param pError - Error data.
     * @param pZone - Zone of error.
     */
    public static allocateError(pError: any, pZone: InteractionZone): void {
        ErrorAllocation.mZone = pZone;
        ErrorAllocation.mError = pError;
    }

    /**
     * Get interaction zone of error.
     * 
     * @param pError - Error.
     */
    public static getInteractionZone(pError: any): InteractionZone | null {
        if (pError === ErrorAllocation.mError) {
            return ErrorAllocation.mZone;
        }

        return null;
    }
}