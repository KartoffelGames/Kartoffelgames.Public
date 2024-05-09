import { List } from '@kartoffelgames/core.data';
import { ChangeDetection, ChangeDetectionReason } from '@kartoffelgames/web.change-detection';

/**
 * Loop detection. Shedules asynchron tasks and reports an error when too many task where chained.
 * Tasks are chained when a new task is sheduled while the current is currently running.
 * 
 * @internal
 */
export class LoopDetectionHandler {
    private mAnotherTaskSheduled: boolean;
    private readonly mCurrentCallChain: List<ChangeDetectionReason>;
    private readonly mMaxStackSize: number;
    private mNextSheduledTask: number;
    private mOnError: ErrorHandler | null;

    /**
     * Get if loop detection has an active task.
     */
    public get hasActiveTask(): boolean {
        return this.mAnotherTaskSheduled;
    }

    /**
     * Set callback for asynchron errors.
     */
    public set onError(pErrorHandler: ErrorHandler) {
        this.mOnError = pErrorHandler;
    }

    /**
     * Constructor.
     */
    public constructor(pMaxStackSize: number) {
        this.mCurrentCallChain = new List<ChangeDetectionReason>();
        this.mMaxStackSize = pMaxStackSize;
        this.mOnError = null;
        this.mNextSheduledTask = 0;
        this.mAnotherTaskSheduled = false;
    }

    /**
     * Calls function asynchron. Checks for loops and
     * Throws error if stack overflows.
     * 
     * @param pUserFunction - Function that should be called.
     * @param pReason - Stack reason.
     */
    public callAsynchron<T>(pUserFunction: () => T, pReason: ChangeDetectionReason): void {
        // Skip asynchron task when currently a call is sheduled.
        if (this.mAnotherTaskSheduled) {
            return;
        }

        // Lock creation of a new task until current task is started.
        this.mAnotherTaskSheduled = true;

        // Create and expand call chain.
        this.mCurrentCallChain.push(pReason);

        // Function for asynchron call.
        const lAsynchronTask = () => {
            // Sheduled task executed, allow another task to be executed.
            this.mAnotherTaskSheduled = false;

            // Save current call chain length. Used to detect a new chain link after execution.
            const lLastCallChainLength: number = this.mCurrentCallChain.length;

            try {
                // Call task. If no other call was sheduled during this call, the length will be the same after. 
                pUserFunction();

                // Throw if too many calles were chained. 
                if (this.mCurrentCallChain.length > this.mMaxStackSize) {
                    throw new LoopError('Call loop detected', this.mCurrentCallChain);
                }

                // Clear call chain list if no other call in this cycle was made.
                if (lLastCallChainLength === this.mCurrentCallChain.length) {
                    this.mCurrentCallChain.clear();
                }
            } catch (pException) {
                // Unblock further calls and clear call chain.
                this.mCurrentCallChain.clear();

                // Cancel next call cycle.
                globalThis.cancelAnimationFrame(this.mNextSheduledTask);

                // Permanently block another execution for this loop detection handler. Prevents script locks.
                this.mAnotherTaskSheduled = true;

                // Execute on error.
                this.mOnError?.(pException);
            }
        };

        // Call on next frame. 
        // Do not call change detection on requestAnimationFrame but anything in the task has change detection.
        this.mNextSheduledTask = ChangeDetection.current.silentExecution(globalThis.requestAnimationFrame, lAsynchronTask);
    }
}

type ErrorHandler = (pError: any) => void;

export class LoopError extends Error {
    private readonly mChain: Array<ChangeDetectionReason>;

    /**
     * Asynchron call chain.
     */
    public get chain(): Array<ChangeDetectionReason> {
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
    public constructor(pMessage: string, pChain: Array<ChangeDetectionReason>) {
        super(pMessage);
        this.mChain = [...pChain];
    }
}