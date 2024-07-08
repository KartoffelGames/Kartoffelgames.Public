import { Writeable } from '@kartoffelgames/core';
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

    // TODO: Comment.
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