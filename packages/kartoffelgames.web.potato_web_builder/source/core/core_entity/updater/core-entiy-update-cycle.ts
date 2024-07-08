import { Writeable } from '@kartoffelgames/core';
import { CoreEntityInteractionEvent } from '../interaction-tracker/core-entity-processor-proxy';
import { CoreEntityUpdater } from './core-entity-updater';

export class CoreEntityUpdateCycle {
    private static mCurrentUpdateCycle: UpdateCycle | null = null;

    /**
     * Open a new cycle with same configuration as reshedules cycle.
     * 
     * @param pResheduledCycle - Cycle that should be resheduled.
     * @param pCycleScope - Callback called in cycle scope.
     * 
     * @returns {@link pCycleScope}s returned value.
     */
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
                // When the cycle is a reshedule of another one, keep the original runner.
                runner: pResheduledCycle.runner
            };

            // Set created state.
            lCreatorScope = true;
        }

        // Call callback within cycle scope.
        try {
            return pCycleScope(CoreEntityUpdateCycle.mCurrentUpdateCycle);
        } finally {
            // Only the call that created the cycle, can close it.
            if (lCreatorScope) {
                CoreEntityUpdateCycle.mCurrentUpdateCycle = null;
            }
        }
    }

    /**
     * Open a new or read the current update cycle. 
     * Whenn a cycle is currently open, then this cycle is used instead of creating a new one.
     * Only new created cycles uses the set configuration of {@link pConfig}.
     * 
     * @param pConfig - Config of newly created cycle.
     * @param pCycleScope - Callback called in cycle scope.
     * 
     * @returns {@link pCycleScope}s returned value.
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

                runner: { id: Symbol('Runner ' + lTimeStamp) }
            };

            // Set created state.
            lCreatorScope = true;
        }

        // Call callback within cycle scope.
        try {
            return pCycleScope(CoreEntityUpdateCycle.mCurrentUpdateCycle);
        } finally {
            // Only the call that created the cycle, can close it.
            if (lCreatorScope) {
                CoreEntityUpdateCycle.mCurrentUpdateCycle = null;
            }
        }
    }

    /**
     * Update the cycle with a new runner configuration.
     * Only updates the configuration when it is requested in the root updater context.
     * 
     * @param pCycle - Cycle.
     * @param pUpdater - Updater that is currently accessing the cycle.
     */
    public static updateCycleRunId(pCycle: UpdateCycle, pUpdater: CoreEntityUpdater): void {
        if (pCycle.initiator === pUpdater) {
            const lWriteableCycle: Writeable<UpdateCycle> = pCycle;
            lWriteableCycle.runner = { id: Symbol('Runner ' + globalThis.performance.now()) };
        }
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
     * Resheduled cycles time stamp.
     */
    readonly runner: UpdateCycleRunner;
};

export type UpdateCycleRunner = {
    id: symbol;
};

export type CoreEntityUpdateCycleConfig = {
    updater: CoreEntityUpdater,
    reason: CoreEntityInteractionEvent,
    runSync: boolean,
};