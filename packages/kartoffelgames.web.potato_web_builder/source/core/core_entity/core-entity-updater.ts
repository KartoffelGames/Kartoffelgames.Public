import { Stack } from '@kartoffelgames/core';
import { InteractionEvent, InteractionZone } from '@kartoffelgames/web.interaction-zone';
import { PwbConfiguration, PwbDebugLogLevel } from '../configuration/pwb-configuration';
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
export class CoreEntityUpdater {
    private readonly mInteractionZone: InteractionZone;
    private readonly mLogLevel: PwbDebugLogLevel;
    private readonly mRegisteredObjects: WeakMap<object, CoreEntityProcessorProxy<object>>;
    private readonly mUpdateFunction: UpdateListener;
    private readonly mUpdateInformation: UpdateInformation;

    /**
     * Constructor.
     * @param pUpdateScope - Update scope.
     */
    public constructor(pParameter: CoreEntityUpdateZoneConstructorParameter) {
        this.mRegisteredObjects = new WeakMap<object, CoreEntityProcessorProxy<object>>();
        this.mUpdateFunction = pParameter.onUpdate;
        this.mLogLevel = pParameter.debugLevel;

        // Init loop detection values.
        this.mUpdateInformation = {
            completeHooks: new Stack<UpdateChainCompleteHookRelease>(),
            shedule: {
                sheduledIdentifier: null,
                runningIdentifier: null,
                nextTask: null
            }
        };

        // Read parent zone from parent updater, when not set, use current zone.
        const lParentInteractionZone: InteractionZone = pParameter.parent?.mInteractionZone ?? InteractionZone.current;

        // Create isolated or default zone as parent zone or, when not specified, current zones child.
        const lRandomLabelSuffix: string = Math.floor(Math.random() * 0xffffff).toString(16);
        this.mInteractionZone = lParentInteractionZone.create(`${pParameter.label}-ProcessorZone (${lRandomLabelSuffix})`, { isolate: pParameter.isolate })
            .addTriggerRestriction(UpdateTrigger, pParameter.trigger);
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
            this.sheduleUpdateTask(pReason);
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
     * Allways triggers with {@link UpdateTrigger.Manual}.
     * 
     * @public
     */
    public async update(): Promise<boolean> {
        // Create independend interaction event for manual shedule.
        const lManualUpdateEvent: CoreEntityInteractionEvent = new InteractionEvent<UpdateTrigger, CoreEntityInteractionData>(UpdateTrigger, UpdateTrigger.Manual, this.mInteractionZone, {
            source: this,
            property: Symbol('Manual Update')
        });

        // Shedule an update task.
        return this.sheduleUpdateTask(lManualUpdateEvent);
    }

    /**
     * Wait for the component update.
     * Returns Promise<false> if there is currently no update cycle.
     */
    private async addUpdateChainCompleteHook(): Promise<boolean> {
        // Add new callback to waiter line.
        return new Promise<boolean>((pResolve, pReject) => {
            this.mUpdateInformation.completeHooks.push((pWasUpdated: boolean, pError: any) => {
                if (pError) {
                    pReject(pError);
                } else {
                    pResolve(pWasUpdated);
                }
            });
        });
    }

    /**
     * Execute task.
     * Executes the next sheduled task after execution when a new task is set.
     * 
     * @param pUpdateTask - Task event, that triggered the update.
     * @param pFrameTimeStamp - Timestamp of the frame that started the update.
     * @param pStack - Current update stack.
     * @param pUpdatedState - If current task should start with an updated state.
     * 
     * @returns task execution result of complete update chain.
     */
    private async executeTask(pUpdateTask: CoreEntityInteractionEvent, pFrameTimeStamp: number, pStack: Stack<CoreEntityInteractionEvent>, pUpdatedState: boolean): Promise<UpdaterTaskExecutionResult> {
        // Create and expand call chain when it was not resheduled.
        if (pUpdateTask !== pStack.top) {
            pStack.push(pUpdateTask);
        }

        // Measure performance.
        const lStartPerformance = globalThis.performance.now();

        // Reshedule task when frame time exceeds MAX_FRAME_TIME. Update called next frame.
        if (lStartPerformance - pFrameTimeStamp > PwbConfiguration.configuration.updating.frameTime) {
            return { resheduled: true, updated: false, error: null, task: pUpdateTask, stack: pStack };
        }

        try {
            // Call task. If no other call was sheduled during this call, the length will be the same after. 
            const lUpdatedState: boolean = await this.mInteractionZone.execute(async () => {
                return this.mUpdateFunction.call(this, pUpdateTask);
            }) || pUpdatedState;

            // Log performance time.
            if (PwbConfiguration.configuration.log.updatePerformance) {
                PwbConfiguration.print(this.mLogLevel, 'Update performance:', this.mInteractionZone.name,
                    '\n\t', 'Update time:', globalThis.performance.now() - lStartPerformance,
                    '\n\t', 'Frame  time:', globalThis.performance.now() - pFrameTimeStamp,
                    '\n\t', 'Frame  timestamp:', pFrameTimeStamp,
                    '\n\t', 'Updatestate:', lUpdatedState,
                    '\n\t', 'Updatechain: ', pStack.toArray().map((pReason) => { return pReason.toString(); }),
                );
            }

            // Throw if too many calles were chained.
            if (pStack.size > PwbConfiguration.configuration.updating.stackCap) {
                throw new UpdateLoopError('Call loop detected', pStack.toArray());
            }

            // Clear call chain list if no other call in this cycle was made.
            if (this.mUpdateInformation.shedule.nextTask === null) {
                return { updated: lUpdatedState, error: null, resheduled: false, task: pUpdateTask, stack: pStack };
            } else {
                // Buffer next task and allow another one to be chained.
                const lNextTask: CoreEntityInteractionEvent = this.mUpdateInformation.shedule.nextTask;
                this.mUpdateInformation.shedule.nextTask = null;

                // Restart chain when current task was triggered from event changes.
                let lStack: Stack<CoreEntityInteractionEvent> = pStack;
                if (pUpdateTask.trigger === UpdateTrigger.InputChange) {
                    lStack = new Stack<CoreEntityInteractionEvent>();
                    lStack.push(pUpdateTask);
                }

                // Execute next task and merge current updated flag with recursion update flags.
                return this.executeTask(lNextTask, pFrameTimeStamp, lStack, lUpdatedState);
            }
        } catch (pException) {
            // No update happened on errors.
            return { updated: false, error: pException, resheduled: false, task: pUpdateTask, stack: pStack };
        }
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
        while ((lHookRelease = this.mUpdateInformation.completeHooks.pop())) {
            lHookRelease(pUpdated, pError);
        }
    }

    /**
     * Shedule asyncron update. Checks for loops and throws {@link UpdateLoopError} on to many continuous updates.
     * Triggers update on next frame.
     * 
     * @throws {@link UpdateLoopError} - When {@link MAX_STACK_SIZE} or more continuous updates where made.
     * 
     * @returns if anything was updated.
     */
    private async sheduleUpdateTask(pUpdateTask: CoreEntityInteractionEvent): Promise<boolean> {
        // Log update trigger time.
        if (PwbConfiguration.configuration.log.updaterTrigger) {
            PwbConfiguration.print(this.mLogLevel, 'Update trigger:', this.mInteractionZone.name,
                '\n\t', 'Trigger:', pUpdateTask.toString(),
                '\n\t', 'Is dropped:', this.mUpdateInformation.shedule.sheduledIdentifier !== null,
                '\n\t', 'Is queued:', this.mUpdateInformation.shedule.sheduledIdentifier === null && this.mUpdateInformation.shedule.runningIdentifier !== null,
                '\n\t', 'Is sheduled:', this.mUpdateInformation.shedule.sheduledIdentifier === null && this.mUpdateInformation.shedule.runningIdentifier === null,
                '\n\t', 'Stacktrace:', { stack: pUpdateTask.stacktrace },
            );
        }

        // Save task as possible next update action when currently a task is running.
        // Also saves next task when the current task is currently reshedulled.
        if (this.mUpdateInformation.shedule.runningIdentifier !== null) {
            this.mUpdateInformation.shedule.nextTask = pUpdateTask;

            // Add then chain to current promise task. Task is resolved on completing all updates or rejected on any error. 
            return this.addUpdateChainCompleteHook();
        }

        // Skip asynchron task when currently a call is sheduled.
        if (this.mUpdateInformation.shedule.sheduledIdentifier !== null) {
            // Add then chain to current promise task. Task is resolved on completing all updates or rejected on any error. 
            return this.addUpdateChainCompleteHook();
        }

        const lShedule = (pTask: CoreEntityInteractionEvent, pStack: Stack<CoreEntityInteractionEvent>, pUpdatedState: boolean) => {
            // Call on next frame. 
            this.mUpdateInformation.shedule.sheduledIdentifier = globalThis.requestAnimationFrame(async (pFrameTimeStamp: number) => {
                // Sheduled task executed, allow another task to be executed.
                this.mUpdateInformation.shedule.runningIdentifier = this.mUpdateInformation.shedule.sheduledIdentifier;
                this.mUpdateInformation.shedule.sheduledIdentifier = null;

                // Create new update chain.
                const lExecutionTask: UpdaterTaskExecutionResult = await this.executeTask(pTask, pFrameTimeStamp, pStack, pUpdatedState);

                // Reshedule current task. Do not cleanup current running.
                if (lExecutionTask.resheduled) {
                    // Skip any progression on resheduled task.
                    lShedule(lExecutionTask.task, lExecutionTask.stack, lExecutionTask.updated);
                    return;
                }

                // When anything has updated, clear running task.
                this.mUpdateInformation.shedule.runningIdentifier = null;

                // Handle errors.
                if (lExecutionTask.error) {
                    // Cancel next call cycle.
                    globalThis.cancelAnimationFrame(this.mUpdateInformation.shedule.sheduledIdentifier ?? 0);

                    if (!PwbConfiguration.configuration.error.ignore) {
                        // Block shedulling another task.
                        this.mUpdateInformation.shedule.sheduledIdentifier = -1;
                    } else {
                        // Print error.
                        PwbConfiguration.print(this.mLogLevel, lExecutionTask.error);

                        // But remove it.
                        lExecutionTask.error = null;
                    }
                }

                // Release chain complete hook without error.
                this.releaseUpdateChainCompleteHooks(lExecutionTask.updated, lExecutionTask.error);
            });
        };

        // Shedule task with new stack.
        lShedule(pUpdateTask, new Stack<CoreEntityInteractionEvent>(), false);

        // Add then chain to current promise task. Task is resolved on completing all updates or rejected on any error. 
        return this.addUpdateChainCompleteHook();
    }
}

type CoreEntityUpdateZoneConstructorParameter = {
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
     * Parent updater.
     */
    parent: CoreEntityUpdater | undefined;

    /**
     * Function executed on sheduled update.
     */
    onUpdate: UpdateListener;
};

type UpdaterTaskExecutionResult = {
    updated: boolean;
    error: any | null;
    resheduled: boolean;
    stack: Stack<CoreEntityInteractionEvent>;
    task: CoreEntityInteractionEvent;
};

type UpdateChainCompleteHookRelease = (pUpdated: boolean, pError: any) => void;
type UpdateInformation = {
    shedule: {
        sheduledIdentifier: number | null;
        runningIdentifier: number | null;
        nextTask: CoreEntityInteractionEvent | null;
    };
    completeHooks: Stack<UpdateChainCompleteHookRelease>;
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