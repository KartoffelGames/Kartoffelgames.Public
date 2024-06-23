import { List } from '@kartoffelgames/core.data';
import { InteractionReason, InteractionResponseType, InteractionZone } from '@kartoffelgames/web.change-detection';
import { UpdateTrigger } from '../../../enum/update-trigger.enum';

/**
 * Loop detection. Shedules asynchron tasks and reports an error when too many task where chained.
 * Tasks are chained when a new task is sheduled while the current is currently running.
 * 
 * @internal
 */
export class LoopDetectionHandler {
    private readonly mCallChain: List<InteractionReason>;
    private readonly mChainCompleteHookReleaseList: List<ChainCompleteHookRelease>;
    private mHasActiveTask: boolean;
    private readonly mMaxStackSize: number;
    private mNextSheduledTask: number;

    /**
     * Get if loop detection has an active task.
     */
    public get hasActiveTask(): boolean {
        return this.mHasActiveTask;
    }

    /**
     * Constructor.
     */
    public constructor(pMaxStackSize: number) {
        this.mCallChain = new List<InteractionReason>();
        this.mChainCompleteHookReleaseList = new List<ChainCompleteHookRelease>();

        this.mMaxStackSize = pMaxStackSize;
        this.mNextSheduledTask = 0;

        this.mHasActiveTask = false;
    }

    /**
     * Calls function asynchron. Checks for loops and callbacks errors on the {@link onError} callback.
     * 
     * 
     * @remarks 
     * Task will be executed outside any interaction zone. So the task itself must handle the actual scope.
     * 
     * @param pUserFunction - Function that should be called.
     * @param pReason - Stack reason.
     */
    public async sheduleTask<T>(pUserFunction: () => T, pReason: InteractionReason): Promise<void> {
        // Save current execution zone stack. To restore it for user function call.
        const lCurrentZone: InteractionZone = InteractionZone.current;

        // Function for asynchron call.
        const lAsynchronTask = () => {
            // Sheduled task executed, allow another task to be executed.
            this.mHasActiveTask = false;

            // Save current call chain length. Used to detect a new chain link after execution.
            const lLastCallChainLength: number = this.mCallChain.length;

            try {
                // Call task. If no other call was sheduled during this call, the length will be the same after. 
                lCurrentZone.execute(pUserFunction);

                // Throw if too many calles were chained. // TODO: Make this optional. Only throw in debug mode.
                if (this.mCallChain.length > this.mMaxStackSize) {
                    throw new LoopError('Call loop detected', this.mCallChain);
                }

                // Clear call chain list if no other call in this cycle was made.
                if (lLastCallChainLength === this.mCallChain.length) {
                    this.mCallChain.clear();

                    // Release chain complete hook.
                    this.releaseChainCompleteHooks();
                }
            } catch (pException) {
                // Unblock further calls and clear call chain.
                this.mCallChain.clear();

                // Cancel next call cycle.
                globalThis.cancelAnimationFrame(this.mNextSheduledTask);

                // Permanently block another execution for this loop detection handler. Prevents script locks.
                this.mHasActiveTask = true;

                // Release chain complete hook with error.
                this.releaseChainCompleteHooks(pException);
            }
        };

        // Do not trigger interaction detection on requestAnimationFrame. The task function should handle the actual interaction zone scope.
        return new InteractionZone('Sheduled-Update', { trigger: <InteractionResponseType><unknown>UpdateTrigger.None, isolate: true }).execute(async () => {
            // Skip asynchron task when currently a call is sheduled.
            if (this.mHasActiveTask) {
                // Add then chain to current promise task. Task is resolved on completing all updates or rejected on any error. 
                return this.addChainCompleteHook();
            }

            // Create and expand call chain.
            this.mCallChain.push(pReason);

            // Lock creation of a new task until current task is started.
            this.mHasActiveTask = true;

            // Call on next frame. 
            this.mNextSheduledTask = globalThis.requestAnimationFrame(lAsynchronTask);

            // Add then chain to current promise task. Task is resolved on completing all updates or rejected on any error. 
            return this.addChainCompleteHook();
        });
    }

    /**
     * Wait for the component update.
     * Returns Promise<false> if there is currently no update cycle.
     */
    private async addChainCompleteHook(): Promise<void> {
        // Add new callback to waiter line.
        return new Promise<void>((pResolve, pReject) => {
            this.mChainCompleteHookReleaseList.push((pError: any) => {
                if (pError) {
                    pReject(pError);
                } else {
                    pResolve();
                }
            });
        });
    }

    /**
     * Release all chain complete hooks.
     * Pass on any thrown error to all hook releases.
     * 
     * @param pError - Error object.
     */
    private releaseChainCompleteHooks(pError?: any): void {
        // Release all waiter.
        for (const lHookRelease of this.mChainCompleteHookReleaseList) {
            lHookRelease(pError);
        }

        // Clear hook release list.
        this.mChainCompleteHookReleaseList.clear();
    }
}

type ChainCompleteHookRelease = (pError: any) => void;

export class LoopError extends Error {
    private readonly mChain: Array<InteractionReason>;

    /**
     * Asynchron call chain.
     */
    public get chain(): Array<InteractionReason> {
        // More of the same. Needs no testing.
        /* istanbul ignore next */
        return this.mChain;
    }

    /**
     * Constructor.
     * Create loop error.
     * @param pMessage - Error Message.
     * @param pChain - Current call chain.
     */
    public constructor(pMessage: string, pChain: Array<InteractionReason>) {
        // Add first 5 reasons to message.
        const lChainMessage = pChain.slice(-20).map((pItem) => { return pItem.toString(); }).join('\n');

        super(`${pMessage}: \n${lChainMessage}`);
        this.mChain = [...pChain];
    }
}