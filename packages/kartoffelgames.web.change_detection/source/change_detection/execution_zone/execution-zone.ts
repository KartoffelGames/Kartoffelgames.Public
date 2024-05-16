import { ChangeReason } from '../change-reason';
import { DetectionCatchType } from '../enum/detection-catch-type.enum';
import { ErrorAllocation } from './error-allocation';

/**
 * Detects if registered object has possibly changed or any asynchron function inside this zone was executed.
 * Can' check for async and await
 */
export class ExecutionZone {
    private static mCurrentZone: ExecutionZone = new ExecutionZone('Default');

    /**
     * Current execution zone.
     */
    public static get current(): ExecutionZone {
        return ExecutionZone.mCurrentZone;
    }

    private mInteractionCallback: InteractionCallback | null;
    private readonly mName: string;

    /**
     * Name of zone.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Get change callback.
     */
    public get onInteraction(): InteractionCallback | null {
        return this.mInteractionCallback;
    }

    /**
     * Set change callback.
     */
    public set onInteraction(pInteractionCallback: InteractionCallback | null) {
        this.mInteractionCallback = pInteractionCallback;
    }

    /**
     * Constructor.
     * Create new zone.
     * @param pZoneName - Name of zone.
     */
    public constructor(pZoneName: string) {
        this.mName = pZoneName;
        this.mInteractionCallback = null;
    }

    /**
     * Executes function in this execution zone.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    public executeInZone<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T {
        // Save current executing zone.
        const lLastZone: ExecutionZone = ExecutionZone.current;

        // Set this zone as execution zone and execute function.
        ExecutionZone.mCurrentZone = this;
        let lResult: any;

        // Try to execute
        try {
            lResult = pFunction(...pArgs);
        } catch (pError) {
            ErrorAllocation.allocateError(pError, this);
            throw pError;
        } finally {
            // Dispach change event. // TODO: Add Correct CatchType parameter
            this.dispatchChangeEvent(new ChangeReason(DetectionCatchType.SyncronCall, pFunction));

            // Reset to last zone.
            ExecutionZone.mCurrentZone = lLastZone;
        }

        return lResult;
    }

    /**
     * Executes function in this execution zone.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    public executeInZoneSilent<T>(pFunction: (...pArgs: Array<any>) => T, ...pArgs: Array<any>): T {
        // Save current executing zone.
        const lLastZone: ExecutionZone = ExecutionZone.current;

        // Set this zone as execution zone and execute function.
        ExecutionZone.mCurrentZone = this;
        let lResult: any;

        // Try to execute
        try {
            lResult = pFunction(...pArgs);
        } catch (pError) {
            ErrorAllocation.allocateError(pError, this);
            throw pError;
        } finally {
            // Reset to last zone.
            ExecutionZone.mCurrentZone = lLastZone;
        }

        return lResult;
    }

    /**
     * Dispatch change event.
     * @param pZoneName - Zone name.
     */
    private dispatchChangeEvent(pChangeReason: ChangeReason): void {
        // Call change callbacks.
        this.onInteraction?.(pChangeReason);
    }
}

type InteractionCallback = (pChangeReason: ChangeReason) => void;
