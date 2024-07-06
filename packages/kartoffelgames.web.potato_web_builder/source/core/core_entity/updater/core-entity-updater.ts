import { Stack } from '@kartoffelgames/core';
import { InteractionEvent, InteractionZone } from '@kartoffelgames/web.interaction-zone';
import { PwbConfiguration, PwbDebugLogLevel } from '../../configuration/pwb-configuration';
import { UpdateTrigger } from '../../enum/update-trigger.enum';
import { CoreEntityInteractionData, CoreEntityInteractionEvent, CoreEntityProcessorProxy } from '../interaction-tracker/core-entity-processor-proxy';
import { IgnoreInteractionTracking } from '../interaction-tracker/ignore-interaction-tracking.decorator';
import { CoreEntityUpdateCycle, UpdateCycle } from './core-entiy-update-cycle';
import { UpdateLoopError } from './update-loop-error';

/**
 * Base Updater of any core entity. Handles automatic and manual update detection.
 * Integrates a loop detection to throw {@link UpdateLoopError} on to many continuous updates.
 * 
 * @internal
 */
@IgnoreInteractionTracking
export class CoreEntityUpdater {
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

            // Shedule auto update.
            this.runUpdateAsynchron(pReason);
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
        return this.runUpdateSynchron(lManualUpdateEvent);
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
    private executeTaskChain(pUpdateTask: CoreEntityInteractionEvent, pUpdateCycle: UpdateCycle, pUpdateState: boolean, pStack: Stack<CoreEntityInteractionEvent>): UpdaterTaskExecutionResult {
        // Throw if too many calles were chained.
        if (pStack.size > PwbConfiguration.configuration.updating.stackCap) {
            throw new UpdateLoopError('Call loop detected', pStack.toArray());
        }

        // Measure performance.
        const lStartPerformance = globalThis.performance.now();

        // Reshedule task when frame time exceeds MAX_FRAME_TIME. Update called next frame.
        if (!pUpdateCycle.sync && lStartPerformance - pUpdateCycle.timeStamp > PwbConfiguration.configuration.updating.frameTime) {
            return { resheduled: true, updated: false, error: null };
        }

        // Create and expand call chain when it was not resheduled.
        pStack.push(pUpdateTask);

        try {
            // Call task. If no other call was sheduled during this call, the length will be the same after. 
            const lUpdatedState: boolean = this.mInteractionZone.execute(() => {
                return this.mUpdateFunction.call(this, pUpdateTask);
            }) || pUpdateState;

            // Log performance time.
            if (PwbConfiguration.configuration.log.updatePerformance) {
                PwbConfiguration.print(this.mLogLevel, 'Update performance:', this.mInteractionZone.name,
                    '\n\t', 'Update time:', globalThis.performance.now() - lStartPerformance,
                    '\n\t', 'Frame  time:', globalThis.performance.now() - pUpdateCycle.timeStamp,
                    '\n\t', 'Frame  timestamp:', pUpdateCycle.timeStamp, // TODO: Maybe, use a id after all.
                    '\n\t', 'Updatestate:', lUpdatedState,
                    '\n\t', 'Updatechain: ', pStack.toArray().map((pReason) => { return pReason.toString(); }),
                );
            }

            if (!this.mUpdateInformation.cycle.nextTask) {
                // Return execution result.
                return { updated: lUpdatedState, error: null, resheduled: false };
            }

            // Buffer next running task and remove it from queue.
            const lNextTask: CoreEntityInteractionEvent = this.mUpdateInformation.cycle.nextTask;
            this.mUpdateInformation.cycle.nextTask = null;

            // Restart next task in a sub cycle.
            return this.executeTaskChain(lNextTask, pUpdateCycle, lUpdatedState, pStack);
        } catch (pException) {
            // No update happened on errors.
            return { updated: false, error: pException, resheduled: false };
        }
    }

    /**
     * Release all chain complete hooks.
     * Pass on any thrown error to all hook releases.
     * 
     * @param pError - Error object.
     */
    private releaseUpdateChainCompleteHooks(pUpdated: boolean, pError?: any): void {
        // Performance boost of 25% when while is not started.
        if (!this.mUpdateInformation.cycleCompleteHooks.top) {
            return;
        }

        // Release all waiter.
        let lHookRelease: UpdateChainCompleteHookRelease | undefined;
        while ((lHookRelease = this.mUpdateInformation.cycleCompleteHooks.pop())) {
            lHookRelease(pUpdated, pError);
        }
    }

    /**
     * Shedules {@link pUpdateTask} to the next frame.
     * Calls {@link runUpdateSynchron} inside a none sync forced update cycle.
     * 
     * @param pUpdateTask - Trigger information of update task.
     */
    private runUpdateAsynchron(pUpdateTask: CoreEntityInteractionEvent): void {
        // Throw away update task that happens while a task is already shedulled.
        if (this.mUpdateInformation.async.sheduledTaskId !== null) {
            return;
        }

        // Save update tasks that happens while update is running to be executed in current cycle.
        if (this.mUpdateInformation.async.runningTaskId !== null) {
            this.mUpdateInformation.cycle.nextTask = pUpdateTask;
            return;
        }

        this.mUpdateInformation.async.sheduledTaskId = window.requestAnimationFrame(() => {
            // Switch sheduled to running task.
            this.mUpdateInformation.async.runningTaskId = this.mUpdateInformation.async.sheduledTaskId;
            this.mUpdateInformation.async.sheduledTaskId = null;

            // Open a async cylce in wich the sync update runs. So the sync cycle reshedules long running tasks. 
            CoreEntityUpdateCycle.openUpdateCycle({ updater: this, reason: pUpdateTask, runSync: false }, () => {
                this.runUpdateSynchron(pUpdateTask);
            });

            // Clear running tasks after update.
            this.mUpdateInformation.async.runningTaskId = null;
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
                '\n\t', 'Chained:', this.mUpdateInformation.sync.running,
                '\n\t', 'Stacktrace:', { stack: pUpdateTask.stacktrace },
            );
        }

        // When the current update is running, save the most current update task as next update.
        if (this.mUpdateInformation.sync.running) {
            this.mUpdateInformation.cycle.nextTask = pUpdateTask;
            return false;
        }

        // Set synchron update to running state.
        this.mUpdateInformation.sync.running = true;

        // Try to request a sync update state.
        const lUpdateResult: UpdaterTaskExecutionResult = CoreEntityUpdateCycle.openUpdateCycle({ updater: this, reason: pUpdateTask, runSync: true }, (pUpdateCycle: UpdateCycle) => {
            // Read from cache when the update was already run in a previous cycle.
            if (pUpdateCycle.resheduleOf && this.mCycleUpdateResult.has(pUpdateCycle.resheduleOf)) {
                return this.mCycleUpdateResult.get(pUpdateCycle)!;
            }

            // Dont execute task when the cycle is allready resheduled.
            if (pUpdateCycle.resheduled) {
                return { resheduled: true, updated: false, error: null };
            }

            // Execute task.
            const lExecutionResult: UpdaterTaskExecutionResult = this.executeTaskChain(pUpdateTask, pUpdateCycle, false, new Stack<CoreEntityInteractionEvent>());

            // Reshedule task to next frame. On sync cycles the resheduled flag is never set.
            // Request the initiator of the current cycle to restart the update process.
            if (lExecutionResult.resheduled) {
                CoreEntityUpdateCycle.resheduleUpdateCycle();

                // False for now, but maybe in the resheduled task it is true.
                return { resheduled: true, updated: false, error: null };
            }

            // Only when no error occoured, save the update cycle result.
            if (!lExecutionResult.error) {
                this.mCycleUpdateResult.set(pUpdateCycle, lExecutionResult);
            }

            // Handle errors.
            if (lExecutionResult.error && PwbConfiguration.configuration.error.ignore) {
                // Print error.
                PwbConfiguration.print(this.mLogLevel, lExecutionResult.error);

                // But remove it.
                lExecutionResult.error = null;
            }

            return lExecutionResult;
        });

        // Set synchron update to finished running state.
        this.mUpdateInformation.sync.running = false;

        // Dont execute next when resheduled only return "no update made".
        // The resheduled cycle should fix the "wrong" result.
        if (lUpdateResult.resheduled) {
            return false;
        }

        // Release chain complete hooks.
        this.releaseUpdateChainCompleteHooks(lUpdateResult.updated, lUpdateResult.error);

        return lUpdateResult.updated;
    }
}

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