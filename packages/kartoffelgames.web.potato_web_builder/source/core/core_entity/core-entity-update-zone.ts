import { Stack } from '@kartoffelgames/core';
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
    private static readonly mDebugger: ComponentDebug = new ComponentDebug();

    private readonly mInteractionZone: InteractionZone;
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
     * 
     * @returns task execution result of complete update chain.
     */
    private async executeTask(pUpdateTask: CoreEntityInteractionEvent, pFrameTimeStamp: number, pStack: Stack<CoreEntityInteractionEvent>): Promise<UpdaterTaskExecutionResult> {
        // Create and expand call chain.
        pStack.push(pUpdateTask);

        // TODO: Reshedule task when frame time exceeds a time (100ms?)
        // But keep chain complete hooks open, dont extend chain.

        try {
            // Measure performance.
            const lStartPerformance = globalThis.performance.now();

            // Call task. If no other call was sheduled during this call, the length will be the same after. 
            const lUpdated: boolean = await this.mInteractionZone.execute(async () => {
                return this.mUpdateFunction.call(this, pUpdateTask);
            });

            // Log performance time.
            if (CoreEntityUpdateZone.mDebugger.configuration.logUpdatePerformance) {
                CoreEntityUpdateZone.mDebugger.print('Update performance:', this.mInteractionZone.name,
                    '\n\t', 'Update time:', globalThis.performance.now() - lStartPerformance,
                    '\n\t', 'Frame  time:', globalThis.performance.now() - pFrameTimeStamp,
                    '\n\t', 'Frame  timestamp:', pFrameTimeStamp,
                    '\n\t', 'Updatechain: ', pStack.toArray().map((pReason) => { return pReason.toString(); }),
                );
            }

            // Throw if too many calles were chained.
            if (pStack.size > CoreEntityUpdateZone.MAX_STACK_SIZE) {
                throw new UpdateLoopError('Call loop detected', pStack.toArray());
            }

            // Clear call chain list if no other call in this cycle was made.
            if (this.mUpdateInformation.shedule.nextTask === null) {
                return { updated: lUpdated, error: null };
            } else {
                // TODO: Why are these not correctly chaining??????
                const lNextTask: CoreEntityInteractionEvent = this.mUpdateInformation.shedule.nextTask;
                this.mUpdateInformation.shedule.nextTask = null;

                // Execute next task and merge current updated flag with recursion update flags.
                const lChainedUpdateResult: UpdaterTaskExecutionResult = await this.executeTask(lNextTask, pFrameTimeStamp, pStack);
                return {
                    updated: lUpdated || lChainedUpdateResult.updated,
                    error: lChainedUpdateResult.error
                };
            }
        } catch (pException) {
            // Cancel next call cycle.
            globalThis.cancelAnimationFrame(this.mUpdateInformation.shedule.sheduledIdentifier ?? 0);

            // Permanently block another execution for this update zone. Prevents script locks.
            if (CoreEntityUpdateZone.mDebugger.configuration.throwWhileUpdating) {
                // Block shedulling another task.
                this.mUpdateInformation.shedule.sheduledIdentifier = -1;

                // Exit execution with error.
                return { updated: false, error: pException };
            } else {
                // Print debug information.
                CoreEntityUpdateZone.mDebugger.print(pException);

                // Exit execution without error.
                return { updated: false, error: null };
            }
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
        if (CoreEntityUpdateZone.mDebugger.configuration.logUpdaterTrigger) {
            // TODO: Different log levels. All queued and sheduled.

            CoreEntityUpdateZone.mDebugger.print('Update trigger:', this.mInteractionZone.name,
                '\n\t', 'Trigger:', pUpdateTask.toString(),
                '\n\t', 'Is dropped:', this.mUpdateInformation.shedule.sheduledIdentifier !== null,
                '\n\t', 'Is queued:', this.mUpdateInformation.shedule.sheduledIdentifier === null && this.mUpdateInformation.shedule.runningIdentifier !== null,
                '\n\t', 'Is sheduled:', this.mUpdateInformation.shedule.sheduledIdentifier === null && this.mUpdateInformation.shedule.runningIdentifier === null,
                '\n\t', 'Stacktrace:', { stack: pUpdateTask.stacktrace },
            );
        }

        // Skip asynchron task when currently a call is sheduled.
        if (this.mUpdateInformation.shedule.sheduledIdentifier !== null) {
            // Add then chain to current promise task. Task is resolved on completing all updates or rejected on any error. 
            return this.addUpdateChainCompleteHook();
        }

        // Save task as possible next update action when currently a task is running.
        // The task will be executed after current action has run through.
        if (this.mUpdateInformation.shedule.runningIdentifier !== null) {
            this.mUpdateInformation.shedule.nextTask = pUpdateTask;

            // Add then chain to current promise task. Task is resolved on completing all updates or rejected on any error. 
            return this.addUpdateChainCompleteHook();
        }

        // Call on next frame. 
        this.mUpdateInformation.shedule.sheduledIdentifier = globalThis.requestAnimationFrame(async (pFrameTimeStamp: number) => {
            // Sheduled task executed, allow another task to be executed.
            this.mUpdateInformation.shedule.runningIdentifier = this.mUpdateInformation.shedule.sheduledIdentifier;
            this.mUpdateInformation.shedule.sheduledIdentifier = null;

            // Create new update chain.
            const lExecutionTask: UpdaterTaskExecutionResult = await this.executeTask(pUpdateTask, pFrameTimeStamp, new Stack<CoreEntityInteractionEvent>());

            // When anything has updated, clear running task.
            this.mUpdateInformation.shedule.runningIdentifier = null;

            // Release chain complete hook with error.
            this.releaseUpdateChainCompleteHooks(lExecutionTask.updated, lExecutionTask.error);
        });

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
    parent: CoreEntityUpdateZone | undefined;

    /**
     * Function executed on sheduled update.
     */
    onUpdate: UpdateListener;
};

type UpdaterTaskExecutionResult = {
    updated: boolean;
    error: any | null;
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