import { ChangeDetectionReason } from '../change-detection-reason';
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

    /**
     * Dispatch interaction event in current zone.
     * 
     * @param pChangeReason - Interaction reason.
     */
    public static dispatchInteractionEvent(pChangeReason: ChangeDetectionReason): void {
        for (const lListener of ExecutionZone.mCurrentZone.mInteractionCallbackList) {
            lListener(pChangeReason);
        }
    }

    private readonly mInteractionCallbackList: Array<InteractionCallback>;
    private readonly mName: string;

    /**
     * Name of zone.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Constructor.
     * Create new zone.
     * 
     * @param pZoneName - Name of zone.
     */
    public constructor(pZoneName: string) {
        this.mName = pZoneName;
        this.mInteractionCallbackList = new Array<InteractionCallback>();
    }

    /**
     * Add interaction listener.
     * 
     * @param pChangeListener - On interaction listener.
     */
    public addInteractionListener(pChangeListener: InteractionCallback): void {
        this.mInteractionCallbackList.push(pChangeListener);
    }

    /**
     * Executes function in this execution zone.
     * 
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
            // Reset to last zone.
            ExecutionZone.mCurrentZone = lLastZone;
        }

        return lResult;
    }
}

type InteractionCallback = (pChangeReason: ChangeDetectionReason) => void;
