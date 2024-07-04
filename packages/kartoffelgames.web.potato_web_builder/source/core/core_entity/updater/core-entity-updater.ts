import { Exception, Stack } from '@kartoffelgames/core';
import { InteractionEvent, InteractionZone } from '@kartoffelgames/web.interaction-zone';
import { PwbConfiguration, PwbDebugLogLevel } from '../../configuration/pwb-configuration';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { CoreEntityInteractionData, CoreEntityInteractionEvent, CoreEntityProcessorProxy } from '../interaction-tracker/core-entity-processor-proxy';
import { IgnoreInteractionTracking } from '../interaction-tracker/ignore-interaction-tracking.decorator';

/**
 * Base Updater of any core entity. Handles automatic and manual update detection.
 * Integrates a loop detection to throw {@link UpdateLoopError} on to many continuous updates.
 * 
 * @internal
 */
@IgnoreInteractionTracking
export class CoreEntityUpdater {
    private static mCurrentUpdateCycle: UpdateCycle | null = null;

    /**
     * Open a new or read the current update cycle. 
     * 
     * @param pCycleScope - Callback called in cycle scope.
     * @param pReason - Reason of cycle creation.
     * @param pRunSync - If, when the cycle should be created, should be executed synchron.
     * @returns 
     */
    private static openUpdateCycle<T>(pCycleScope: (pCycle: UpdateCycle) => T, pUpdater: CoreEntityUpdater, pReason: CoreEntityInteractionEvent, pRunSync: boolean): T {
        // When the current call created the cycle.
        let lCreatorCall: boolean = false;

        // Init new update cycle when
        if (!CoreEntityUpdater.mCurrentUpdateCycle) {
            const lTimeStamp = globalThis.performance.now();

            // Create new cycle.
            CoreEntityUpdater.mCurrentUpdateCycle = {
                initiator: pUpdater,
                timeStamp: lTimeStamp,
                sync: pRunSync,
                reason: pReason,
                resheduledTimeStamp: null
            };

            // Set created state.
            lCreatorCall = true;
        }

        // Call callback within cycle scope.
        const lCallResult: T = pCycleScope(CoreEntityUpdater.mCurrentUpdateCycle);

        // Only the call that created the cycle, can close it.
        if (lCreatorCall) {
            CoreEntityUpdater.mCurrentUpdateCycle = null;
        }

        // Return scope.
        return lCallResult;
    }

    private static resheduleUpdateCycle(): void {
        // Only when in current cycle.
        if (!CoreEntityUpdater.mCurrentUpdateCycle) {
            throw new Exception(`There is no update cycle that can be resheduled.`, CoreEntityUpdater);
        }

        // TODO: Call async update on initiator with changed resheduledTimeStamp.
    }

    private readonly mCycleUpdateResult: WeakMap<UpdateCycle, UpdaterTaskExecutionResult>;
    private readonly mInteractionZone: InteractionZone;
    private readonly mLogLevel: PwbDebugLogLevel;
    private readonly mRegisteredObjects: WeakMap<object, CoreEntityProcessorProxy<object>>;
    private readonly mUpdateFunction: UpdateListener;
    private readonly mUpdateInformation: UpdateInformation;

    /**
     * Log level of updater.
     */
    protected get logLevel(): PwbDebugLogLevel {
        return this.mLogLevel;
    }

    /**
     * Updater zone.
     */
    protected get zone(): InteractionZone {
        return this.mInteractionZone;
    }

    /**
     * Constructor.
     * @param pUpdateScope - Update scope.
     */
    public constructor(pParameter: BaseCoreEntityUpdateZoneConstructorParameter) {
        this.mCycleUpdateResult = new WeakMap<UpdateCycle, UpdaterTaskExecutionResult>();
        this.mRegisteredObjects = new WeakMap<object, CoreEntityProcessorProxy<object>>();
        this.mUpdateFunction = pParameter.onUpdate;
        this.mLogLevel = pParameter.debugLevel;

        // Read parent zone from parent updater, when not set, use current zone.
        const lParentInteractionZone: InteractionZone = pParameter.parent?.mInteractionZone ?? InteractionZone.current;

        // Create isolated or default zone as parent zone or, when not specified, current zones child.
        const lRandomLabelSuffix: string = Math.floor(Math.random() * 0xffffff).toString(16);
        this.mInteractionZone = lParentInteractionZone.create(`${pParameter.label}-ProcessorZone (${lRandomLabelSuffix})`, { isolate: pParameter.isolate })
            .addTriggerRestriction(UpdateTrigger, pParameter.trigger);

        // Init loop detection values.
        this.mUpdateInformation = {
            cycleCompleteHooks: new Stack<UpdateChainCompleteHookRelease>(),
            async: {
                sheduledTaskId: null,
                runningTaskId: null
            },
            sync: {
                running: false
            },
            cycle: {
                nextTask: null
            }
        };
    }

    /**
     * Add update trigger to entity.
     * Autmatic update is triggered when a interaction with the set triggers is pushed to the zone.
     * 
     * @param pUpdateTrigger - Triggers that should update trigger a update.
     */
    public addUpdateTrigger(pUpdateTrigger: UpdateTrigger): void {
        // Add listener for interactions. Shedules an update on interaction zone.
        this.mInteractionZone.addInteractionListener(UpdateTrigger, (pReason: CoreEntityInteractionEvent) => {
            // Only update
            if ((pUpdateTrigger & pUpdateTrigger) === 0) {
                return;
            }

            // Shedule auto update. // TODO: Make this async
            this.onSynchronUpdate(pReason);
        });
    }

    /**
     * Deconstruct update zone. 
     */
    public deconstruct(): void {
        // Disconnect from change listener. Does nothing if listener is not defined.
        this.mInteractionZone.removeInteractionListener(UpdateTrigger);
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
     * Resolve promise after the update cycle completes.
     * Promise is rejected with any update error.
     * 
     * @returns true when anything was updated.
     */
    public async resolveAfterUpdate(): Promise<boolean> {
        // When nothing is sheduled, nothing will be updated.
        if (!this.mUpdateInformation.async.sheduledTaskId) {
            return false;
        }

        // Add new callback to waiter line.
        return new Promise<boolean>((pResolve, pReject) => {
            this.mUpdateInformation.cycleCompleteHooks.push((pWasUpdated: boolean, pError: any) => {
                if (pError) {
                    pReject(pError);
                } else {
                    pResolve(pWasUpdated);
                }
            });
        });
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
     * Manually start a synchron update.
     */
    public updateSync(): boolean {
        // Create independend interaction event for manual shedule.
        const lManualUpdateEvent: CoreEntityInteractionEvent = new InteractionEvent<UpdateTrigger, CoreEntityInteractionData>(UpdateTrigger, UpdateTrigger.Manual, this.mInteractionZone, {
            source: this,
            property: Symbol('Manual Update')
        });

        // Run synchron update.
        return this.onSynchronUpdate(lManualUpdateEvent);
    }

    /**
     * Execute update task queue and get the combined update results.
     * 
     * @param pUpdateTask - Update task
     * @param pUpdateCyle - Current update cycle.
     * @param pStack - Current update stack.
     * 
     * @returns Update task result.
     */
    private executeTask(pUpdateTask: CoreEntityInteractionEvent, pCycleTimeStamp: number, pRunSync: boolean): UpdaterTaskExecutionResult {
        // Measure performance.
        const lStartPerformance = globalThis.performance.now();

        // Reshedule task when frame time exceeds MAX_FRAME_TIME. Update called next frame.
        if (!pRunSync && lStartPerformance - pCycleTimeStamp > PwbConfiguration.configuration.updating.frameTime) {
            return { resheduled: true, updated: false, error: null };
        }

        // TODO: Update chain and loop detection.

        try {
            // Call task. If no other call was sheduled during this call, the length will be the same after. 
            const lUpdatedState: boolean = this.mInteractionZone.execute(() => {
                return this.mUpdateFunction.call(this, pUpdateTask);
            });

            // Return execution result.
            return { updated: lUpdatedState, error: null, resheduled: false };
        } catch (pException) {
            // No update happened on errors.
            return { updated: false, error: pException, resheduled: false };
        }
    }


    /**
     * On update shedule. Takes an update task and shedules it to the next available cycle.
     * 
     * @param pUpdateTask - Trigger information of update task.
     */
    private onSynchronUpdate(pUpdateTask: CoreEntityInteractionEvent): boolean {
        // When the current update is running, save the most current update task as next update.
        if (this.mUpdateInformation.sync.running) {
            this.mUpdateInformation.cycle.nextTask = pUpdateTask;
            return false;
        }

        // Set synchron update to running state.
        this.mUpdateInformation.sync.running = true;

        // Try to request a sync update state.
        const lUpdateResult: UpdaterTaskExecutionResult = CoreEntityUpdater.openUpdateCycle((pUpdateCycle: UpdateCycle) => {
            // Read from cache when the update was already run in the current cycle.
            if (this.mCycleUpdateResult.has(pUpdateCycle)) {
                return this.mCycleUpdateResult.get(pUpdateCycle)!;
            }

            // Execute task.
            const lExecutionResult: UpdaterTaskExecutionResult = this.executeTask(pUpdateTask, pUpdateCycle.timeStamp, pUpdateCycle.sync);

            // Reshedule task to next frame. On sync cycles the resheduled flag is never set.
            // Request the initiator of the current cycle to restart the update process.
            if (lExecutionResult.resheduled) {
                CoreEntityUpdater.resheduleUpdateCycle();

                // False for now, but maybe in the resheduled task it is true.
                return { resheduled: true, updated: false, error: null };
            }

            // Handle errors.
            if (lExecutionResult.error && PwbConfiguration.configuration.error.ignore) {
                // Print error.
                PwbConfiguration.print(this.mLogLevel, lExecutionResult.error);

                // But remove it.
                lExecutionResult.error = null;
            }

            // On error, throw it.
            if (lExecutionResult.error) {
                throw lExecutionResult.error;
            }

            // Cache update result for this cycle.
            this.mCycleUpdateResult.set(pUpdateCycle, lExecutionResult);

            return lExecutionResult;
        }, this, pUpdateTask, true);

        // Set synchron update to finished running state.
        this.mUpdateInformation.sync.running = false;

        // Dont execute next when resheduled only return "no update made".
        // The resheduled cycle should fix the "wrong" result.
        if (lUpdateResult.resheduled) {
            return false;
        }

        // Trigger the next task when existing. Start it in a possible another cycle.
        if (this.mUpdateInformation.cycle.nextTask) {
            // Buffer next running task and remove it from queue.
            const lNextTask: CoreEntityInteractionEvent = this.mUpdateInformation.cycle.nextTask;
            this.mUpdateInformation.cycle.nextTask = null;

            return this.onSynchronUpdate(lNextTask) || lUpdateResult.updated;
        }

        return lUpdateResult.updated;
    }

    /**
     * Release all chain complete hooks.
     * Pass on any thrown error to all hook releases.
     * 
     * @param pError - Error object.
     */
    private releaseUpdateChainCompleteHooks(pUpdated: boolean, pError?: any): void {
        // Release all waiter.
        let lHookRelease: UpdateChainCompleteHookRelease | undefined;
        while ((lHookRelease = this.mUpdateInformation.cycleCompleteHooks.pop())) {
            lHookRelease(pUpdated, pError);
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
     * Initiator task. The reason why this cycle was started.
     */
    readonly reason: CoreEntityInteractionEvent;

    /**
     * Resheduled cycles time stamp.
     */
    readonly resheduledTimeStamp: number | null;
};


type UpdateChainCompleteHookRelease = (pUpdated: boolean, pError: any) => void;

type UpdateInformation = {
    cycle: {
        nextTask: CoreEntityInteractionEvent | null;
    },
    async: {
        sheduledTaskId: number | null;
        runningTaskId: number | null;
    };
    sync: {
        running: boolean;
    };
    cycleCompleteHooks: Stack<UpdateChainCompleteHookRelease>;
};


type UpdaterTaskExecutionResult = {
    updated: boolean;
    error: any | null;
    resheduled: boolean;
};

/**
 * Construction parameter.
 */
type UpdateListener = (pReason: CoreEntityInteractionEvent) => boolean;
type BaseCoreEntityUpdateZoneConstructorParameter = {
    /**
     * Debug label.
     */
    label: string;

    /**
     * Debug level for this entity.
     */
    debugLevel: PwbDebugLogLevel;

    /**
     * Isolate trigger and dont send them to parent zones.
     */
    isolate: boolean;

    /**
     * Trigger that can be send to this and parent zones.
     * When any zone added a updateTrigger, they can auto update with them.
     */
    trigger: UpdateTrigger;

    /**
     * Updater parent zone.
     */
    parent: CoreEntityUpdater | undefined;

    /**
     * Function executed on sheduled update.
     */
    onUpdate: UpdateListener;
};