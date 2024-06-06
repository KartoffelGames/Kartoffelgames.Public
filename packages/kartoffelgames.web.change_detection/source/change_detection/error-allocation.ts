import { InteractionZoneStack } from './interaction-zone';

/**
 * Allocates current error to its interaction zone.
 */
export class ErrorAllocation {
    private static mError: any;
    private static mZoneStack: InteractionZoneStack;

    /**
     * Allocate error with interaction zone.
     * 
     * @param pError - Error data.
     * @param pZone - Zone of error.
     */
    public static allocateError(pError: any, pZoneStack: InteractionZoneStack): void {
        ErrorAllocation.mZoneStack = pZoneStack;
        ErrorAllocation.mError = pError;
    }

    /**
     * Get interaction zone stack of error.
     * 
     * @param pError - Error.
     */
    public static getZoneStack(pError: any): InteractionZoneStack | null {
        if (pError === ErrorAllocation.mError) {
            return ErrorAllocation.mZoneStack;
        }

        return null;
    }
}