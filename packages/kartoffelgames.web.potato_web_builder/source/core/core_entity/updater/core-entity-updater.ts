import { Stack } from '@kartoffelgames/core';
import { InteractionEvent, InteractionZone } from '@kartoffelgames/web.interaction-zone';
import { PwbConfiguration, PwbDebugLogLevel } from '../../configuration/pwb-configuration';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { CoreEntityInteractionData, CoreEntityInteractionEvent, CoreEntityProcessorProxy } from '../interaction-tracker/core-entity-processor-proxy';
import { IgnoreInteractionTracking } from '../interaction-tracker/ignore-interaction-tracking.decorator';
import { CoreEntityUpdateCycle, UpdateCycle, UpdateCycleRunner } from './core-entiy-update-cycle';
import { UpdateLoopError } from './update-loop-error';
import { UpdateResheduleError } from './update-reshedule-error';

/**
 * Base Updater of any core entity. Handles automatic and manual update detection.
 * Integrates a loop detection to throw {@link UpdateLoopError} on to many continuous updates.
 * 
 * @internal
 */
@IgnoreInteractionTracking
export class CoreEntityUpdater {
    private readonly mInteractionZone: InteractionZone;
    private readonly mLogLevel: PwbDebugLogLevel;
    private readonly mRegisteredObjects: WeakMap<object, CoreEntityProcessorProxy<object>>;
    private readonly mUpdateFunction: UpdateListener;
    private readonly mUpdateRunCache: WeakMap<UpdateCycleRunner, boolean>;
    private readonly mUpdateStates: UpdateInformation;

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
        // Init lists.
        this.mUpdateRunCache = new WeakMap<UpdateCycleRunner, boolean>();
        this.mRegisteredObjects = new WeakMap<object, CoreEntityProcessorProxy<object>>();

        // Init updater settings.
        this.mUpdateFunction = pParameter.onUpdate;
        this.mLogLevel = pParameter.debugLevel;

        // Read parent zone from parent updater, when not set, use current zone.
        const lParentInteractionZone: InteractionZone = pParameter.parent?.mInteractionZone ?? InteractionZone.current;

        // Create isolated or default zone from found parent interaction zone.
        const lRandomLabelSuffix: string = Math.floor(Math.random() * 0xffffff).toString(16);
        this.mInteractionZone = lParentInteractionZone.create(`${pParameter.label}-ProcessorZone (${lRandomLabelSuffix})`, { isolate: pParameter.isolate })
            .addTriggerRestriction(UpdateTrigger, pParameter.trigger);

        // Init loop detection values.
        this.mUpdateStates = {
            chainCompleteHooks: new Stack<UpdateChainCompleteHookRelease>(),
            async: {
                hasSheduledTask: false,
                hasRunningTask: false,
                sheduledTaskIsResheduled: false
            },
            sync: {
                running: false
            },
            cycle: {
                chainedTask: null
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

            // Shedule auto update.
            this.runUpdateAsynchron(pReason, null);
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
                        InteractionZone.pushInteraction<UpdateTrigger, CoreEntityInteractionData>(UpdateTrigger, UpdateTrigger.InputChange, CoreEntityProcessorProxy.createCoreEntityCreationData(pObject, lEventName));
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
        if (!this.mUpdateStates.async.hasSheduledTask) {
            return false;
        }

        // Add new callback to waiter line.
        return new Promise<boolean>((pResolve, pReject) => {
            this.mUpdateStates.chainCompleteHooks.push((pWasUpdated: boolean, pError: any) => {
                if (pError) {
                    pReject(pError);
                } else {
                    pResolve(pWasUpdated);
                }
            });
        });
    }

    /**
     * Execute function with inside updater context.
     * Registers any changes made with the set trigger type of this updater.
     * 
     * @param pFunction - Function.
     */
    public switchToUpdateZone<T>(pFunction: () => T): T {
        return this.mInteractionZone.execute(pFunction);
    }

    /**
     * Manually start a synchron update.
     * When the update is called inside a asynchron update scope, it will minimize frame time overflows by resheduling this update.
     */
    public update(): boolean {
        // Create independend interaction event for manual shedule.
        const lManualUpdateEvent: CoreEntityInteractionEvent = new InteractionEvent<UpdateTrigger, CoreEntityInteractionData>(UpdateTrigger, UpdateTrigger.Manual, this.mInteractionZone, CoreEntityProcessorProxy.createCoreEntityCreationData(this, Symbol('Manual Update')));

        // Run synchron update.
        return this.runUpdateSynchron(lManualUpdateEvent);
    }

    /**
     * Manually start a asynchron update.
     */
    public updateAsync(): void {
        // Create independend interaction event for manual shedule.
        const lManualUpdateEvent: CoreEntityInteractionEvent = new InteractionEvent<UpdateTrigger, CoreEntityInteractionData>(UpdateTrigger, UpdateTrigger.Manual, this.mInteractionZone, CoreEntityProcessorProxy.createCoreEntityCreationData(this, Symbol('Manual Update')));

        // Run synchron update.
        this.runUpdateAsynchron(lManualUpdateEvent, null);
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
    private executeTaskChain(pUpdateTask: CoreEntityInteractionEvent, pUpdateCycle: UpdateCycle, pUpdateState: boolean, pStack: Stack<CoreEntityInteractionEvent>): boolean {
        // Throw if too many calles were chained.
        if (pStack.size > PwbConfiguration.configuration.updating.stackCap) {
            throw new UpdateLoopError('Call loop detected', pStack.toArray());
        }

        // Measure performance.
        const lStartPerformance = globalThis.performance.now();

        // Reshedule task when frame time exceeds MAX_FRAME_TIME. Update called next frame.
        if (!pUpdateCycle.forcedSync && lStartPerformance - pUpdateCycle.startTime > PwbConfiguration.configuration.updating.frameTime) {
            throw new UpdateResheduleError();
        }

        // Create and expand call chain when it was not resheduled.
        pStack.push(pUpdateTask);

        // Call task. If no other call was sheduled during this call, the length will be the same after. 
        const lUpdatedState: boolean = this.mInteractionZone.execute(() => {
            return this.mUpdateFunction.call(this, pUpdateTask);
        }) || pUpdateState;

        // Log performance time.
        if (PwbConfiguration.configuration.log.updatePerformance) {
            const lCurrentTimestamp: number = globalThis.performance.now();

            PwbConfiguration.print(this.mLogLevel, 'Update performance:', this.mInteractionZone.name,
                '\n\t', 'Cycle:', lCurrentTimestamp - pUpdateCycle.timeStamp, 'ms',
                '\n\t', 'Runner:', lCurrentTimestamp - pUpdateCycle.runner.timestamp, 'ms',
                '\n\t', '  ', 'Id:', pUpdateCycle.runner.id.toString(),
                '\n\t', 'Update:', lCurrentTimestamp - lStartPerformance, 'ms',
                '\n\t', '  ', 'State:', lUpdatedState,
                '\n\t', '  ', 'Chain: ', pStack.toArray().map((pReason) => { return pReason.toString(); }),
            );
        }

        // Set new runner id after run through.
        // When the update function has resheduled, the resheduled cycle runs with the same runner id, bc of the error that skips this call.
        CoreEntityUpdateCycle.updateCycleRunId(pUpdateCycle, this); // TODO: Yep this is not working. :(

        // Exit execution chain when no task is chained.
        if (!this.mUpdateStates.cycle.chainedTask) {
            return lUpdatedState;
        }

        // Buffer next running task and remove it from queue.
        const lNextTask: CoreEntityInteractionEvent = this.mUpdateStates.cycle.chainedTask;
        this.mUpdateStates.cycle.chainedTask = null;

        // Restart next task in a sub cycle.
        return this.executeTaskChain(lNextTask, pUpdateCycle, lUpdatedState, pStack);
    }

    /**
     * Release all chain complete hooks.
     * Pass on any thrown error to all hook releases.
     * 
     * @param pError - Error object.
     */
    private releaseUpdateChainCompleteHooks(pUpdated: boolean, pError?: any): void {
        // Performance boost of 25% when while is not started.
        if (!this.mUpdateStates.chainCompleteHooks.top) {
            return;
        }

        // Release all waiter.
        let lHookRelease: UpdateChainCompleteHookRelease | undefined;
        while ((lHookRelease = this.mUpdateStates.chainCompleteHooks.pop())) {
            lHookRelease(pUpdated, pError);
        }
    }

    /**
     * Shedules {@link pUpdateTask} to the next frame.
     * Calls {@link runUpdateSynchron} inside a none sync forced update cycle.
     * 
     * @param pUpdateTask - Trigger information of update task.
     */
    private runUpdateAsynchron(pUpdateTask: CoreEntityInteractionEvent, pResheduledCycle: UpdateCycle | null): void {
        // Save tasks that happens while a task is allready running or the current sheduled task is a incomplete resheduled one.
        if (this.mUpdateStates.async.hasRunningTask || this.mUpdateStates.async.sheduledTaskIsResheduled) {
            this.mUpdateStates.cycle.chainedTask = pUpdateTask;
            return;
        }

        // Throw away update task that happens while a task is already sheduled.
        if (this.mUpdateStates.async.hasSheduledTask) {
            return;
        }

        const lCycleUpdate = (pRunningCycle: UpdateCycle) => {
            // Switch sheduled to running task.
            this.mUpdateStates.async.hasRunningTask = true;

            // Reset sheduled task flags.
            this.mUpdateStates.async.hasSheduledTask = false;
            this.mUpdateStates.async.sheduledTaskIsResheduled = false;

            // Flag if this task should be resheduled to next frame or not.
            let lResheduleTask: boolean = false;

            try {
                // Run task as synchron.
                // But bc the current cycle is marked as asynchron, it has the ability to reshedule itself as a asynchron task when it takes to long. 
                this.runUpdateSynchron(pUpdateTask);
            } catch (pError: unknown) {
                // We know that we should reshedule this task when any of the synchronos tasks throws a UpdateResheduleError error.
                if (pError instanceof UpdateResheduleError && pRunningCycle.initiator === this) {
                    // Logable reshedules.
                    if (PwbConfiguration.configuration.log.updateReshedule) {
                        PwbConfiguration.print(this.mLogLevel, 'Reshedule:', this.mInteractionZone.name,
                            '\n\t', 'Cycle Performance', globalThis.performance.now() - pRunningCycle.timeStamp,
                            '\n\t', 'Runner Id:', pRunningCycle.runner.id.toString(),
                        );
                    }

                    lResheduleTask = true;
                }

                // Ignore any other error. They are returned with the resolveAfterUpdate method.
            } finally {
                // Clear running tasks after update.
                this.mUpdateStates.async.hasRunningTask = false;
            }

            // When the current cycle was resheduled, start it again in the next frame, but in a resheduled state.
            if (lResheduleTask) {
                // No need to clear sheduled task id.
                // Any task async shedulled is chained and executed synchronously in the current or resheduled update chain.

                // Shedule current task in a reshedule update cycle.
                this.runUpdateAsynchron(pUpdateTask, pRunningCycle);
            }
        };

        // Set sheduled task flag.
        this.mUpdateStates.async.hasSheduledTask = true;

        // Set sheduled task as resheduled task. Flag used to chain tasks even when a task is shedulled.
        if (pResheduledCycle) {
            this.mUpdateStates.async.sheduledTaskIsResheduled = true;
        }

        // Shedule task on next render frame.
        globalThis.requestAnimationFrame(() => {
            if (pResheduledCycle) {
                // Open a async cylce in wich the sync update runs. So the sync cycle reshedules long running tasks. 
                CoreEntityUpdateCycle.openResheduledCycle(pResheduledCycle, lCycleUpdate);
            } else {
                // Open a async cylce in wich the sync update runs. So the sync cycle reshedules long running tasks. 
                CoreEntityUpdateCycle.openUpdateCycle({ updater: this, reason: pUpdateTask, runSync: false }, lCycleUpdate);
            }
        });
    }

    /**
     * Trys to run a update task syncron. Opens a forced synchron cycle when not running currently inside another one. 
     * When the current cycle is not forced to be synchron {@link executeTaskChain} reshedules current and chained tasks.
     * When a update task is currently running, and this function is called, it chains the task after the currentyl running one.
     * When the complete chain is executed and nothing is resheduled, all complete hooks are released.
     * 
     * @param pUpdateTask - Trigger information of update task.
     * 
     * @returns true when the update task has updated any state.
     */
    private runUpdateSynchron(pUpdateTask: CoreEntityInteractionEvent): boolean {
        // Log update trigger time.
        if (PwbConfiguration.configuration.log.updaterTrigger) {
            PwbConfiguration.print(this.mLogLevel, 'Update trigger:', this.mInteractionZone.name,
                '\n\t', 'Trigger:', pUpdateTask.toString(),
                '\n\t', 'Chained:', this.mUpdateStates.sync.running,
                '\n\t', 'Omitted:', !!this.mUpdateStates.cycle.chainedTask
            );
        }

        // When the current update is running, save the most current update task as next update.
        if (this.mUpdateStates.sync.running) {
            this.mUpdateStates.cycle.chainedTask = pUpdateTask;
            return false;
        }

        // Set synchron update to running state.
        this.mUpdateStates.sync.running = true;

        // Try to request a sync update state.
        try {
            const lUpdateResult: boolean = CoreEntityUpdateCycle.openUpdateCycle({ updater: this, reason: pUpdateTask, runSync: true }, (pUpdateCycle: UpdateCycle): boolean => {
                // Read from cache when the update was already run in a resheduled cycle.
                if (this.mUpdateRunCache.has(pUpdateCycle.runner)) {
                    // Update cycles start time when any update is used.
                    // Prevents very long updates from running into another reshedule without any real update called.
                    // This does remove the frame time guarantee but prevents endless loops.
                    CoreEntityUpdateCycle.updateCyleStartTime(pUpdateCycle);

                    // Read cache. // TODO: Test for nested updates. Maybe clear cache after use.
                    return this.mUpdateRunCache.get(pUpdateCycle.runner)!;
                }

                // Execute task.
                const lExecutionResult: boolean = this.executeTaskChain(pUpdateTask, pUpdateCycle, false, new Stack<CoreEntityInteractionEvent>());

                // Save update result for this cycle. Only saved when no exception occurred.
                this.mUpdateRunCache.set(pUpdateCycle.runner, lExecutionResult);

                return lExecutionResult;
            });

            // Release chain complete hooks.
            this.releaseUpdateChainCompleteHooks(lUpdateResult);

            return lUpdateResult;
        } catch (pError: unknown) {
            // When update is resheduled, trigger cycle resheduled.
            // UpdateReseduleError only happen in async cylces, so the async update function should handle the exception.
            if (pError instanceof UpdateResheduleError) {
                throw pError;
            }

            // Overrideable error value to potential remove the error. 
            let lError: any = pError;

            // Handle errors.
            if (PwbConfiguration.configuration.error.ignore) {
                // Print error.
                PwbConfiguration.print(this.mLogLevel, pError);

                // But remove it.
                lError = null;
            }

            // Release chain complete hooks.
            this.releaseUpdateChainCompleteHooks(false, lError);

            // Rethrow error 
            if (lError) {
                throw pError;
            }

            // When an error is thrown but not used, no update has happened.
            return false;
        } finally {
            // Set synchron update to finished running state.
            this.mUpdateStates.sync.running = false;
        }
    }
}

type UpdateChainCompleteHookRelease = (pUpdated: boolean, pError: any) => void;

type UpdateInformation = {
    cycle: {
        chainedTask: CoreEntityInteractionEvent | null;
    },
    async: {
        hasSheduledTask: boolean;
        hasRunningTask: boolean;
        sheduledTaskIsResheduled: boolean;
    };
    sync: {
        running: boolean;
    };
    chainCompleteHooks: Stack<UpdateChainCompleteHookRelease>;
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
     * Trigger that should be send to this and parent zones.
     * When any zone added a updateTrigger, they can auto update with them.
     */
    trigger: UpdateTrigger;

    /**
     * Updater parent zone.
     */
    parent: CoreEntityUpdater | undefined;

    /**
     * Function executed on update.
     */
    onUpdate: UpdateListener;
};