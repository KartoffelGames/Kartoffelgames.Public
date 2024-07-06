import { CoreEntityInteractionEvent } from '../interaction-tracker/core-entity-processor-proxy';
import { CoreEntityUpdater } from './core-entity-updater';

export class CoreEntityUpdateCycle {
    private static mCurrentUpdateCycle: UpdateCycle | null = null;

    public static openResheduledCycle<T>(pResheduledCycle: UpdateCycle, pCycleScope: (pCycle: UpdateCycle) => T): T {
        // When the current call created the cycle.
        let lCreatorScope: boolean = false;

        // Init new update cycle when not.
        if (!CoreEntityUpdateCycle.mCurrentUpdateCycle) {
            const lTimeStamp = globalThis.performance.now();

            // Create new cycle.
            CoreEntityUpdateCycle.mCurrentUpdateCycle = {
                initiator: pResheduledCycle.initiator,
                timeStamp: lTimeStamp,
                sync: pResheduledCycle.sync,
                reason: pResheduledCycle.reason,
                // When the cycle is a reshedule of another one, keep the original reshedule.
                resheduleOf: pResheduledCycle.resheduleOf || pResheduledCycle
            };

            // Set created state.
            lCreatorScope = true;
        }

        // Call callback within cycle scope.
        const lCallResult: T = pCycleScope(CoreEntityUpdateCycle.mCurrentUpdateCycle);

        // Only the call that created the cycle, can close it.
        if (lCreatorScope) {
            CoreEntityUpdateCycle.mCurrentUpdateCycle = null;
        }

        // Return scope.
        return lCallResult;
    }

    /**
     * Open a new or read the current update cycle. 
     * 
     * @param pCycleScope - Callback called in cycle scope.
     * @param pReason - Reason of cycle creation.
     * @param pRunSync - If, when the cycle should be created, should be executed synchron.
     * @returns 
     */
    public static openUpdateCycle<T>(pConfig: CoreEntityUpdateCycleConfig, pCycleScope: (pCycle: UpdateCycle) => T): T {
        // When the current call created the cycle.
        let lCreatorScope: boolean = false;

        // Init new update cycle when not.
        if (!CoreEntityUpdateCycle.mCurrentUpdateCycle) {
            const lTimeStamp = globalThis.performance.now();

            // Create new cycle.
            CoreEntityUpdateCycle.mCurrentUpdateCycle = {
                initiator: pConfig.updater,
                timeStamp: lTimeStamp,
                sync: pConfig.runSync,
                reason: pConfig.reason,
                resheduleOf: null
            };

            // Set created state.
            lCreatorScope = true;
        }

        // Call callback within cycle scope.
        const lCallResult: T = pCycleScope(CoreEntityUpdateCycle.mCurrentUpdateCycle);

        // Only the call that created the cycle, can close it.
        if (lCreatorScope) {
            CoreEntityUpdateCycle.mCurrentUpdateCycle = null;
        }

        // Return scope.
        return lCallResult;
    }
}

export type UpdateCycle = {
    /**
     * Initiator of update.
     */
    readonly initiator: CoreEntityUpdater;

    /**
     * Starting timestamp of cycle or resheduled cycle.
     */
    readonly timeStamp: number;

    /**
     * The current update should not be resheduled when sync is set.
     */
    readonly sync: boolean;

    /**
     * Initiator task. The reason why this cycle was started.
     */
    readonly reason: CoreEntityInteractionEvent;

    /**
     * Resheduled cycles time stamp.
     */
    readonly resheduleOf: UpdateCycle | null;
};

export type CoreEntityUpdateCycleConfig = {
    updater: CoreEntityUpdater,
    reason: CoreEntityInteractionEvent,
    runSync: boolean,
};