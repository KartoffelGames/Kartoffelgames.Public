import { List } from '@kartoffelgames/core.data';
import { ChangeDetection, ChangeDetectionReason } from '@kartoffelgames/web.change-detection';

// TODO: Needs a slight rework.
export class LoopDetectionHandler {
    private readonly mCurrentCallChain: List<ChangeDetectionReason>;
    private mInActiveChain: boolean;
    private readonly mMaxStackSize: number;
    private mNextSheduledCall: number;
    private mOnError: ErrorHandler | null;

    /**
     * Get if loop detection has an active chain.
     * Active chain breaks when the asynchron function is called.
     * The chain restores, when a new asyncron function is sheduled.
     */
    public get activeChain(): boolean {
        return this.mInActiveChain;
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
        this.mNextSheduledCall = 0;
        this.mInActiveChain = false;
    }

    /**
     * Calls function asynchron. Checks for loops and
     * Throws error if stack overflows.
     * @param pUserFunction - Function that should be called.
     * @param pReason - Stack reason.
     */
    public callAsynchron<T>(pUserFunction: () => T, pReason: ChangeDetectionReason): void {
        if (!this.mInActiveChain) {
            this.mInActiveChain = true;

            // Create and expand call stack.
            this.mCurrentCallChain.push(pReason);

            // Function for asynchron call.
            const lAsynchronFunction = () => {
                // Call function. User can decide on none silent zone inside function.
                // Set component to not updating so new changes doesn't get ignnored.
                this.mInActiveChain = false;
                const lLastLength: number = this.mCurrentCallChain.length;

                try {
                    // Call function after saving last chain length.
                    // If no other call was sheduled during this call, the length will be the same after. 
                    pUserFunction();

                    // Clear call chain list if no other call in this cycle was made.
                    if (lLastLength === this.mCurrentCallChain.length) {
                        this.mCurrentCallChain.clear();
                    } else if (this.mCurrentCallChain.length > this.mMaxStackSize) {
                        // Throw if too many calles were chained. 
                        throw new LoopError('Call loop detected', this.mCurrentCallChain);
                    }
                } catch (pException) {
                    // Execute on error.
                    const lSuppressError: boolean = this.mOnError?.(pException) === true;

                    // Unblock further calls and clear call chain.
                    this.mInActiveChain = false;
                    this.mCurrentCallChain.clear();

                    // Cancel next call cycle.
                    globalThis.cancelAnimationFrame(this.mNextSheduledCall);

                    // Rethrow error. Used only for debugging and testing.
                    /* istanbul ignore else */
                    if (lSuppressError) {
                        // Prevent any other updates. Debug only.
                        this.mInActiveChain = true;
                    } else {
                        throw pException;
                    }
                }
            };

            // Call on next frame. 
            // Do not call change detection on requestAnimationFrame.
            this.mNextSheduledCall = ChangeDetection.current.silentExecution(globalThis.requestAnimationFrame, lAsynchronFunction);
        }
    }
}

type ErrorHandler = (pError: any) => boolean;

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