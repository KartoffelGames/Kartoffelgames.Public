import { Dictionary, List } from '@kartoffelgames/core';
import { InteractionEvent, InteractionZone } from '@kartoffelgames/web.interaction-zone';
import { ComponentDebug } from '../component-debug';
import { ComponentInteractionData, ComponentInteractionEvent, ComponentInteractionType, ComponentProcessorProxy } from '../component/interaction-tracker/component-processor-proxy';
import { IgnoreInteractionTracking } from '../component/interaction-tracker/ignore-interaction-detection.decorator';

/**
 * Update zone of any core entity. Handles automatic and manual update detection.
 * Integrates a loop detection to throw {@link UpdateLoopError} on to many continuous updates.
 * 
 * @internal
 */
@IgnoreInteractionTracking
export class CoreEntityUpdateZone {
    private static readonly MAX_STACK_SIZE: number = 10;
    private static mCallQueue: Dictionary<number, CallQueueFunction> = new Dictionary<number, CallQueueFunction>();
    private static mCallQueueRunning: boolean = false;
    private static readonly mDebugger: ComponentDebug = new ComponentDebug();

    /**
     * Add new action to a call queue.
     * 
     * @param pFunction - Action to queue.
     * 
     * @returns Identifier of action
     */
    private static addActionToCallQueue(pFunction: CallQueueFunction): number {
        const lIdentifier: number = Math.random();

        CoreEntityUpdateZone.mCallQueue.set(lIdentifier, pFunction);

        const lStartQueue = () => {
            globalThis.requestAnimationFrame(async (pTimestamp: number) => {
                // Save current call queue and create a new list for the next execution cycle.
                const lActiveQueue = CoreEntityUpdateZone.mCallQueue;
                CoreEntityUpdateZone.mCallQueue = new Dictionary<number, CallQueueFunction>();

                // Call all requested actions parallel.
                const lRunner: Array<Promise<void>> = new Array<Promise<void>>();
                for (const lFunction of lActiveQueue.values()) {
                    // eslint-disable-next-line @typescript-eslint/await-thenable
                    lRunner.push(lFunction(pTimestamp));
                }

                // Wait for all current actions to settle.
                await Promise.all(lRunner);

                // Enable new runner instance.
                CoreEntityUpdateZone.mCallQueueRunning = false;

                // Start queue again, when new actions where pushed to queue while the active one was processed.
                if (CoreEntityUpdateZone.mCallQueue.size > 0) {
                    lStartQueue();
                }
            });
        };

        // Create new "frame" timer when not already set. 
        if (!CoreEntityUpdateZone.mCallQueueRunning) {
            CoreEntityUpdateZone.mCallQueueRunning = true;

            // Start queue.
            lStartQueue();
        }

        return lIdentifier;
    }

    /**
     * Remove action from call queue.
     * 
     * @param pIdentifier - Action idenfier.
     */
    private static removeActionToCallQueue(pIdentifier: number): void {
        CoreEntityUpdateZone.mCallQueue.delete(pIdentifier);
    }

    private mEnabled: boolean;
    private mHasSheduledUpdate: boolean;
    private readonly mInteractionZone: InteractionZone;
    private readonly mRegisteredObjects: WeakMap<object, ComponentProcessorProxy<object>>;
    private mSheduledUpdateIdentifier: number;
    private readonly mSilentZone: InteractionZone;
    private readonly mUpdateCallChain: List<ComponentInteractionEvent>;
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
    public constructor(pLabel: string, pIsolatedInteraction: boolean, pInteractionTrigger: ComponentInteractionType, pParentZone?: InteractionZone) {
        this.mUpdateListener = new List<UpdateListener>();
        this.mRegisteredObjects = new WeakMap<object, ComponentProcessorProxy<object>>();

        this.mEnabled = false;

        // Init loop detection values.
        this.mUpdateCallChain = new List<ComponentInteractionEvent>();
        this.mUpdateChainCompleteHookReleaseList = new List<UpdateChainCompleteHookRelease>();
        this.mSheduledUpdateIdentifier = 0;
        this.mHasSheduledUpdate = false;

        // Create isolated or default zone as parent zone or, when not specified, current zones child.
        this.mInteractionZone = (pParentZone ?? InteractionZone.current).execute(() => {
            return InteractionZone.current.create(`${pLabel}-ProcessorZone`, { isolate: pIsolatedInteraction }).addTriggerRestriction(ComponentInteractionType, pInteractionTrigger);
        });
        this.mSilentZone = InteractionZone.current.create(`${pLabel}-SilentZone`, { isolate: true }).addTriggerRestriction(ComponentInteractionType, ComponentInteractionType.None);

        // Add listener for interactions. Shedules an update on interaction zone.
        this.mInteractionZone.addInteractionListener(ComponentInteractionType, (pReason: ComponentInteractionEvent) => {
            // Call the actual shedule in silent zone to prevent promise from firing.
            this.mSilentZone.execute(() => {
                this.sheduleUpdateTask(pReason);
            });
        });
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
        this.mInteractionZone.removeInteractionListener(ComponentInteractionType);

        // Remove all update listener.
        this.mUpdateListener.clear();

        // Disable handling.
        this.enabled = false;
    }

    /**
     * Register object and pass on update events.
     * 
     * @param pObject - Object.
     */
    public registerObject<T extends object>(pObject: T): T {
        // Do not patch twice for the same zone.
        if (this.mRegisteredObjects.has(pObject)) {
            return this.mRegisteredObjects.get(pObject)!.proxy as T;
        }

        // Add all events without function.
        if (pObject instanceof EventTarget) {
            for (const lEventName of ['input', 'change']) {
                // Add empty event to element. This should trigger an interaction every time the event and therefore the listener is called.
                this.mInteractionZone.execute(() => {
                    pObject.addEventListener(lEventName, () => { });
                });
            }
        }

        // Create proxy.
        const lObjectProxy: ComponentProcessorProxy<T> = new ComponentProcessorProxy(pObject);

        // Add element as patched entity. Both original and proxied version.
        this.mRegisteredObjects.set(pObject, lObjectProxy);
        this.mRegisteredObjects.set(lObjectProxy.proxy, lObjectProxy);

        // Return proxied version.
        return lObjectProxy.proxy;
    }

    /**
     * Execute function with interaction trigger.
     * 
     * @param pFunction - Function.
     * @param pTrigger - Interaction detection trigger.
     * 
     * @remarks 
     * Nesting {@link disableInteractionTrigger} and {@link switchToUpdateZone} is allowed.
     */
    public switchToUpdateZone<T>(pFunction: () => T): T {
        return this.mInteractionZone.execute(pFunction);
    }

    /**
     * Manual update component.
     * 
     * @public
     */
    public async update(): Promise<boolean> {
        // Create event values.
        const lTrigger: ComponentInteractionType = ComponentInteractionType.Manual;
        const lData: ComponentInteractionData = {
            source: this,
            property: Symbol('Manual Update')
        };

        // Request update to dispatch change events on other components.
        this.mInteractionZone.execute(() => {
            InteractionZone.pushInteraction(ComponentInteractionType, lTrigger, lData);
        });

        // Create independend interaction event for manual shedule.
        const lReason: ComponentInteractionEvent = new InteractionEvent<ComponentInteractionType, ComponentInteractionData>(ComponentInteractionType, lTrigger, this.mInteractionZone, lData);

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
    private async sheduleUpdateTask(pReason: ComponentInteractionEvent): Promise<boolean> {
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
        const lAsynchronTask = async (pFrameTimeStamp: number) => {
            // Sheduled task executed, allow another task to be executed.
            this.mHasSheduledUpdate = false;

            // Save current call chain length. Used to detect a new chain link after execution.
            const lLastCallChainLength: number = this.mUpdateCallChain.length;

            try {
                // TODO: Reshedule task when frame time exceeds a time (100ms?)
                // But keep chain complete hooks open, dont extend chain.

                // Measure performance.
                const lStartPerformance = globalThis.performance.now();

                // Call task. If no other call was sheduled during this call, the length will be the same after. 
                for (const lListener of this.mUpdateListener) {
                    await lListener.call(this, pReason);
                }

                // Log performance time.
                if (CoreEntityUpdateZone.mDebugger.configuration.logUpdatePerformance) {
                    CoreEntityUpdateZone.mDebugger.print('Update performance:', this.mInteractionZone.name,
                        '\n\t', 'Update time:', globalThis.performance.now() - lStartPerformance,
                        '\n\t', 'Frame  time:', globalThis.performance.now() - pFrameTimeStamp,
                        '\n\t', 'Frame  timestamp:', pFrameTimeStamp,
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
                CoreEntityUpdateZone.removeActionToCallQueue(this.mSheduledUpdateIdentifier);

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

        // Do not trigger interaction. The task function should handle the actual interaction zone scope.
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
            this.mSheduledUpdateIdentifier = CoreEntityUpdateZone.addActionToCallQueue(lAsynchronTask);

            // Add then chain to current promise task. Task is resolved on completing all updates or rejected on any error. 
            return this.addUpdateChainCompleteHook();
        });
    }
}

type CallQueueFunction = (pTimestamp: number) => Promise<void>;
type UpdateChainCompleteHookRelease = (pError: any) => void;

export type UpdateListener = (pReason: ComponentInteractionEvent) => Promise<void>;

export class UpdateLoopError extends Error {
    private readonly mChain: Array<ComponentInteractionEvent>;

    /**
     * Asynchron call chain.
     */
    public get chain(): Array<ComponentInteractionEvent> {
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
    public constructor(pMessage: string, pChain: Array<ComponentInteractionEvent>) {
        // Add first 5 reasons to message.
        const lChainMessage = pChain.slice(-20).map((pItem) => { return pItem.toString(); }).join('\n');

        super(`${pMessage}: \n${lChainMessage}`);
        this.mChain = [...pChain];
    }
}