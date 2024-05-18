import { ChangeDetection } from '../change-detection';

/**
 * Allocates current error to its change detection zone.
 */
export class ErrorAllocation {
    private static mError: any;
    private static mZone: ChangeDetection;

    /**
     * Allocate error with execution zone.
     * @param pError - Error data.
     * @param pZone - Zone of error.
     */
    public static allocateError(pError: any, pZone: ChangeDetection): void {
        ErrorAllocation.mZone = pZone;
        ErrorAllocation.mError = pError;
    }

    /**
     * Get changed detection zone of error.
     * 
     * @param pError - Error.
     */
    public static getChangeDetectionOfError(pError: any): ChangeDetection | null {
        if (pError === ErrorAllocation.mError) {
            return ErrorAllocation.mZone;
        }

        return null;
    }
}