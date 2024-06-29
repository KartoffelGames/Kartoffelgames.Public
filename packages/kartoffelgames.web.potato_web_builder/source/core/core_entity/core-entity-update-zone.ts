import { Dictionary, List } from '@kartoffelgames/core';
import { InteractionEvent, InteractionZone } from '@kartoffelgames/web.interaction-zone';
import { ComponentDebug } from '../component-debug';
import { UpdateTrigger } from '../enum/update-trigger.enum';
import { CoreEntityInteractionData, CoreEntityInteractionEvent, CoreEntityProcessorProxy } from './interaction-tracker/core-entity-processor-proxy';
import { IgnoreInteractionTracking } from './interaction-tracker/ignore-interaction-tracking.decorator';

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
    private readonly mRegisteredObjects: WeakMap<object, CoreEntityProcessorProxy<object>>;
    private mSheduledUpdateIdentifier: number;
    private readonly mUpdateCallChain: UpdateChainInformation;
    private readonly mUpdateListener: UpdateListener;

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
    public constructor(pLabel: string, pIsolatedInteraction: boolean, pInteractionTrigger: UpdateTrigger, pParentZone: InteractionZone | null, pListener: UpdateListener) {
        this.mRegisteredObjects = new WeakMap<object, CoreEntityProcessorProxy<object>>();
        this.mUpdateListener = pListener;
        this.mEnabled = false;

        // Init loop detection values.
        this.mUpdateCallChain = {
            wasUpdated: false,
            hookList: new List<UpdateChainCompleteHookRelease>(),
            chainList: new List<CoreEntityInteractionEvent>()
        };
        this.mSheduledUpdateIdentifier = 0;
        this.mHasSheduledUpdate = false;

        // Create isolated or default zone as parent zone or, when not specified, current zones child.
        this.mInteractionZone = (pParentZone ?? InteractionZone.current).create(`${pLabel}-ProcessorZone`, { isolate: pIsolatedInteraction }).addTriggerRestriction(UpdateTrigger, pInteractionTrigger);

        // Add listener for interactions. Shedules an update on interaction zone.
        this.mInteractionZone.addInteractionListener(UpdateTrigger, (pReason: CoreEntityInteractionEvent) => {
            this.sheduleUpdateTask(pReason);
        });
    }

    /**
     * Deconstruct update zone. 
     */
    public deconstruct(): void {
        // Disconnect from change listener. Does nothing if listener is not defined.
        this.mInteractionZone.removeInteractionListener(UpdateTrigger);

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
                    pObject.addEventListener(lEventName, () => {
                        InteractionZone.pushInteraction<UpdateTrigger, CoreEntityInteractionData>(UpdateTrigger, UpdateTrigger.InputChange, {
                            source: pObject,
                            property: lEventName
                        });
                    });
                });
            }
        }

        // Create proxy.
        const lObjectProxy: CoreEntityProcessorProxy<T> = new CoreEntityProcessorProxy(pObject);
        lObjectProxy.addListenerZone(this.mInteractionZone);

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
        const lTrigger: UpdateTrigger = UpdateTrigger.Manual;
        const lData: CoreEntityInteractionData = {
            source: this,
            property: Symbol('Manual Update')
        };

        // Request update to dispatch change events on other components.
        this.mInteractionZone.execute(() => {
            InteractionZone.pushInteraction(UpdateTrigger, lTrigger, lData);
        });

        // Create independend interaction event for manual shedule.
        const lReason: CoreEntityInteractionEvent = new InteractionEvent<UpdateTrigger, CoreEntityInteractionData>(UpdateTrigger, lTrigger, this.mInteractionZone, lData);

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
            this.mUpdateCallChain.hookList.push((pError: any) => {
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
    private releaseUpdateChainCompleteHooks(pUpdated: boolean, pError?: any): void {
        // Release all waiter.
        for (const lHookRelease of this.mUpdateCallChain.hookList) {
            lHookRelease(pUpdated, pError);
        }

        // Clear hook release list.
        this.mUpdateCallChain.hookList.clear();
    }

    /**
     * Shedule asyncron update. Checks for loops and throws {@link UpdateLoopError} on to many continuous updates.
     * Triggers update on next frame.
     * 
     * @throws {@link UpdateLoopError} - When {@link MAX_STACK_SIZE} or more continuous updates where made.
     * 
     * @returns if anything was updated.
     */
    private async sheduleUpdateTask(pReason: CoreEntityInteractionEvent): Promise<boolean> {
        // Skip task shedule when update zone is disabled.
        if (!this.enabled) {
            return false;
        }

        // Log update trigger time.
        if (CoreEntityUpdateZone.mDebugger.configuration.logUpdaterTrigger) {
            CoreEntityUpdateZone.mDebugger.print('Update trigger:', this.mInteractionZone.name,
                '\n\t', 'Trigger:', pReason.toString(),
                '\n\t', 'Is trigger:', !this.mHasSheduledUpdate,
                '\n\t', 'Updatechain: ', this.mUpdateCallChain.chainList.map((pReason) => { return pReason.toString(); }),
                '\n\t', 'Stacktrace:', { stack: pReason.stacktrace },
            );
        }

        // Function for asynchron call.
        const lAsynchronTask = async (pFrameTimeStamp: number) => {
            // Sheduled task executed, allow another task to be executed.
            this.mHasSheduledUpdate = false;

            // Save current call chain length. Used to detect a new chain link after execution.
            const lLastCallChainLength: number = this.mUpdateCallChain.chainList.length;

            try {
                // TODO: Reshedule task when frame time exceeds a time (100ms?)
                // But keep chain complete hooks open, dont extend chain.

                // Measure performance.
                const lStartPerformance = globalThis.performance.now();

                // Call task. If no other call was sheduled during this call, the length will be the same after. 
                this.mUpdateCallChain.wasUpdated ||= await this.mInteractionZone.execute(async () => {
                    return this.mUpdateListener.call(this, pReason);
                });

                // Log performance time.
                if (CoreEntityUpdateZone.mDebugger.configuration.logUpdatePerformance) {
                    CoreEntityUpdateZone.mDebugger.print('Update performance:', this.mInteractionZone.name,
                        '\n\t', 'Update time:', globalThis.performance.now() - lStartPerformance,
                        '\n\t', 'Frame  time:', globalThis.performance.now() - pFrameTimeStamp,
                        '\n\t', 'Frame  timestamp:', pFrameTimeStamp,
                    );
                }

                // Throw if too many calles were chained.
                if (this.mUpdateCallChain.chainList.length > CoreEntityUpdateZone.MAX_STACK_SIZE) {
                    throw new UpdateLoopError('Call loop detected', this.mUpdateCallChain.chainList);
                }

                // Clear call chain list if no other call in this cycle was made.
                if (lLastCallChainLength === this.mUpdateCallChain.hookList.length) {
                    const lWasUpdated: boolean = this.mUpdateCallChain.wasUpdated;

                    // Clear update chain list.
                    this.mUpdateCallChain.hookList.clear();
                    this.mUpdateCallChain.wasUpdated = false;

                    // Release chain complete hook.
                    this.releaseUpdateChainCompleteHooks(lWasUpdated);
                }
            } catch (pException) {
                // Unblock further calls and clear call chain.
                this.mUpdateCallChain.chainList.clear();
                this.mUpdateCallChain.wasUpdated = false;

                // Cancel next call cycle.
                CoreEntityUpdateZone.removeActionToCallQueue(this.mSheduledUpdateIdentifier);

                // Permanently block another execution for this update zone. Prevents script locks.
                if (CoreEntityUpdateZone.mDebugger.configuration.throwWhileUpdating) {
                    this.mHasSheduledUpdate = true;

                    // Release chain complete hook with error.
                    this.releaseUpdateChainCompleteHooks(false, pException);
                } else {
                    // Release chain complete hook without error.
                    this.releaseUpdateChainCompleteHooks(false);

                    CoreEntityUpdateZone.mDebugger.print(pException);
                }
            }
        };

        // Skip asynchron task when currently a call is sheduled.
        if (this.mHasSheduledUpdate) {
            // Add then chain to current promise task. Task is resolved on completing all updates or rejected on any error. 
            return this.addUpdateChainCompleteHook();
        }

        // Create and expand call chain.
        this.mUpdateCallChain.chainList.push(pReason);

        // Lock creation of a new task until current task is started.
        this.mHasSheduledUpdate = true;

        // Call on next frame. 
        this.mSheduledUpdateIdentifier = CoreEntityUpdateZone.addActionToCallQueue(lAsynchronTask);

        // Add then chain to current promise task. Task is resolved on completing all updates or rejected on any error. 
        return this.addUpdateChainCompleteHook();
    }
}

type CallQueueFunction = (pTimestamp: number) => Promise<void>;
type UpdateChainCompleteHookRelease = (pUpdated: boolean, pError: any) => void;
type UpdateChainInformation = {
    chainList: List<CoreEntityInteractionEvent>;
    hookList: List<UpdateChainCompleteHookRelease>;
    wasUpdated: boolean;
};

export type UpdateListener = (pReason: CoreEntityInteractionEvent) => Promise<boolean>;

export class UpdateLoopError extends Error {
    private readonly mChain: Array<CoreEntityInteractionEvent>;

    /**
     * Asynchron call chain.
     */
    public get chain(): Array<CoreEntityInteractionEvent> {
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
    public constructor(pMessage: string, pChain: Array<CoreEntityInteractionEvent>) {
        // Add first 5 reasons to message.
        const lChainMessage = pChain.slice(-20).map((pItem) => { return pItem.toString(); }).join('\n');

        super(`${pMessage}: \n${lChainMessage}`);
        this.mChain = [...pChain];
    }
}