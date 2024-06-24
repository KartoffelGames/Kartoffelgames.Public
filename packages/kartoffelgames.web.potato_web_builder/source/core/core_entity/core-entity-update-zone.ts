import { List } from '@kartoffelgames/core.data';
import { IgnoreInteractionDetection, InteractionReason, InteractionResponseType, InteractionZone } from '@kartoffelgames/web.change-detection';
import { UpdateTrigger } from '../enum/update-trigger.enum';
import { ComponentDebug } from '../component-debug';

/**
 * Update zone of any core entity. Handles automatic and manual update detection.
 * Integrates a loop detection to throw {@link UpdateLoopError} on to many continuous updates.
 * 
 * @internal
 */
@IgnoreInteractionDetection
export class CoreEntityUpdateZone {
    private static readonly MAX_STACK_SIZE: number = 10;
    private static readonly mDebugger: ComponentDebug = new ComponentDebug();

    private mEnabled: boolean;
    private mHasSheduledUpdate: boolean;
    private readonly mInteractionDetectionListener: (pReason: InteractionReason) => void;
    private readonly mInteractionZone: InteractionZone;
    private mSheduledUpdateIdentifier: number;
    private readonly mSilentZone: InteractionZone;
    private readonly mUpdateCallChain: List<InteractionReason>;
    private readonly mUpdateChainCompleteHookReleaseList: List<UpdateChainCompleteHookRelease>;
    private readonly mUpdateListener: List<UpdateListener>;

    /**
     * Get enabled state of update zone.
     * Does not report any updates on disabled state.
     */
    public get enabled(): boolean {
        return this.mEnabled;
    }

    /**
     * Get enabled state of update zone.
     * Does not report any updates on disabled state.
     */
    public set enabled(pEnabled: boolean) {
        this.mEnabled = pEnabled;
    }

    /**
     * Get zone where updates are tracked.
     */
    public get zone(): InteractionZone {
        return this.mInteractionZone;
    }

    /**
     * Constructor.
     * @param pUpdateScope - Update scope.
     */
    public constructor(pLabel: string, pIsolatedInteraction: boolean, pInteractionTrigger: UpdateTrigger, pParentZone?: InteractionZone) {
        this.mUpdateListener = new List<UpdateListener>();
        this.mEnabled = false;

        // Init loop detection values.
        this.mUpdateCallChain = new List<InteractionReason>();
        this.mUpdateChainCompleteHookReleaseList = new List<UpdateChainCompleteHookRelease>();
        this.mSheduledUpdateIdentifier = 0;
        this.mHasSheduledUpdate = false;

        // Create isolated or default zone as parent zone or, when not specified, current zones child.
        this.mInteractionZone = (pParentZone ?? InteractionZone.current).execute(() => {
            return new InteractionZone(`${pLabel}-ProcessorZone`, { isolate: pIsolatedInteraction, trigger: <InteractionResponseType><unknown>pInteractionTrigger });
        });
        this.mSilentZone = new InteractionZone(`${pLabel}-SilentZone`, { isolate: true, trigger: <InteractionResponseType><unknown>UpdateTrigger.None });

        // Shedule an update on interaction zone.
        this.mInteractionDetectionListener = (pReason: InteractionReason) => { this.sheduleUpdateTask(pReason); };

        // Add listener for interactions.
        this.mInteractionZone.addInteractionListener(this.mInteractionDetectionListener);
    }

    /**
     * Listen for updates.
     * @param pListener - Listener.
     */
    public addUpdateListener(pListener: UpdateListener): void {
        this.mUpdateListener.push(pListener);
    }

    /**
     * Deconstruct update zone. 
     */
    public deconstruct(): void {
        // Disconnect from change listener. Does nothing if listener is not defined.
        this.mInteractionZone.removeInteractionListener(this.mInteractionDetectionListener);

        // Remove all update listener.
        this.mUpdateListener.clear();

        // Disable handling.
        this.enabled = false;
    }

    /**
     * Execute function with interaction trigger.
     * 
     * @param pFunction - Function.
     * @param pTrigger - Interaction detection trigger.
     * 
     * @remarks 
     * Nesting {@link disableInteractionTrigger} and {@link enableInteractionTrigger} is allowed.
     */
    public enableInteractionTrigger<T>(pFunction: () => T): T {
        return this.mInteractionZone.execute(pFunction);
    }

    /**
     * Register object and pass on update events.
     * 
     * @param pObject - Object.
     */
    public registerObject<T extends object>(pObject: T): T {
        return this.mInteractionZone.registerObject(pObject);
    }

    /**
     * Request update by sending an update request to the interaction zone.
     * Does nothing when the component is set to be {@link UpdateMode.Manual}
     * 
     * @param pReason - Update reason. Description of changed state.
     */
    public requestUpdate(pReason: InteractionReason): void {
        this.mInteractionZone.execute(() => {
            InteractionZone.dispatchInteractionEvent(pReason);
        });
    }

    /**
     * Manual update component.
     * 
     * @public
     */
    public async update(): Promise<boolean> {
        const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Custom, this, Symbol('Manual Update'));

        // Request update to dispatch change events on other components.
        this.requestUpdate(lReason);

        // Shedule an update task.
        return this.sheduleUpdateTask(lReason);
    }

    /**
     * Wait for the component update.
     * Returns Promise<false> if there is currently no update cycle.
     */
    private async addUpdateChainCompleteHook(): Promise<true> {
        // Add new callback to waiter line.
        return new Promise<true>((pResolve, pReject) => {
            this.mUpdateChainCompleteHookReleaseList.push((pError: any) => {
                if (pError) {
                    pReject(pError);
                } else {
                    pResolve(true);
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
    private releaseUpdateChainCompleteHooks(pError?: any): void {
        // Release all waiter.
        for (const lHookRelease of this.mUpdateChainCompleteHookReleaseList) {
            lHookRelease(pError);
        }

        // Clear hook release list.
        this.mUpdateChainCompleteHookReleaseList.clear();
    }

    /**
     * Shedule asyncron update. Checks for loops and throws {@link UpdateLoopError} on to many continuous updates.
     * Triggers update on next frame.
     * 
     * @throws {@link UpdateLoopError} - When {@link MAX_STACK_SIZE} or more continuous updates where made.
     */
    private async sheduleUpdateTask(pReason: InteractionReason): Promise<boolean> {
        // Skip task shedule when update zone is disabled.
        if (!this.enabled) {
            return false;
        }

        // Log update trigger time.
        if (CoreEntityUpdateZone.mDebugger.configuration.logUpdaterTrigger) {
            CoreEntityUpdateZone.mDebugger.print('Update trigger:', this.mInteractionZone.name,
                '\n\t', 'Trigger:', pReason.toString(),
                '\n\t', 'Is trigger:', !this.mHasSheduledUpdate,
                '\n\t', 'Updatechain: ', this.mUpdateCallChain.map((pReason) => { return pReason.toString(); }),
                '\n\t', 'Stacktrace:', { stack: pReason.stacktrace },
            );
        }

        // Function for asynchron call.
        const lAsynchronTask = (pFrameTimeStamp: number) => {
            // Sheduled task executed, allow another task to be executed.
            this.mHasSheduledUpdate = false;

            // Save current call chain length. Used to detect a new chain link after execution.
            const lLastCallChainLength: number = this.mUpdateCallChain.length;

            try {
                // Measure performance.
                const lStartPerformance = globalThis.performance.now();

                // Call task. If no other call was sheduled during this call, the length will be the same after. 
                for (const lListener of this.mUpdateListener) {
                    lListener.call(this, pReason);
                }

                // Log performance time.
                if (CoreEntityUpdateZone.mDebugger.configuration.logUpdatePerformance) {
                    CoreEntityUpdateZone.mDebugger.print('Update performance:', this.mInteractionZone.name,
                        '\n\t', 'Update time:', globalThis.performance.now() - lStartPerformance,
                        '\n\t', 'Frame  time:', globalThis.performance.now() - pFrameTimeStamp,
                    );
                }

                // Throw if too many calles were chained.
                if (this.mUpdateCallChain.length > CoreEntityUpdateZone.MAX_STACK_SIZE) {
                    throw new UpdateLoopError('Call loop detected', this.mUpdateCallChain);
                }

                // Clear call chain list if no other call in this cycle was made.
                if (lLastCallChainLength === this.mUpdateCallChain.length) {
                    this.mUpdateCallChain.clear();

                    // Release chain complete hook.
                    this.releaseUpdateChainCompleteHooks();
                }
            } catch (pException) {
                // Unblock further calls and clear call chain.
                this.mUpdateCallChain.clear();

                // Cancel next call cycle.
                globalThis.cancelAnimationFrame(this.mSheduledUpdateIdentifier);

                // Permanently block another execution for this update zone. Prevents script locks.
                if (CoreEntityUpdateZone.mDebugger.configuration.throwWhileUpdating) {
                    this.mHasSheduledUpdate = true;

                    // Release chain complete hook with error.
                    this.releaseUpdateChainCompleteHooks(pException);
                } else {
                    // Release chain complete hook without error.
                    this.releaseUpdateChainCompleteHooks();

                    CoreEntityUpdateZone.mDebugger.print(pException);
                }
            }
        };

        // Do not trigger interaction detection on requestAnimationFrame. The task function should handle the actual interaction zone scope.
        return this.mSilentZone.execute(async () => {
            // Skip asynchron task when currently a call is sheduled.
            if (this.mHasSheduledUpdate) {
                // Add then chain to current promise task. Task is resolved on completing all updates or rejected on any error. 
                return this.addUpdateChainCompleteHook();
            }

            // Create and expand call chain.
            this.mUpdateCallChain.push(pReason);

            // Lock creation of a new task until current task is started.
            this.mHasSheduledUpdate = true;

            // Call on next frame. 
            this.mSheduledUpdateIdentifier = globalThis.requestAnimationFrame(lAsynchronTask);

            // Add then chain to current promise task. Task is resolved on completing all updates or rejected on any error. 
            return this.addUpdateChainCompleteHook();
        });
    }
}

type UpdateChainCompleteHookRelease = (pError: any) => void;

export type UpdateListener = (pReason: InteractionReason) => void;

export class UpdateLoopError extends Error {
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