import { Stack } from '@kartoffelgames/core';
import { InteractionZone, InteractionZoneEvent } from '@kartoffelgames/core-interaction-zone';
import { ComponentStateType } from "../component_state/component-state-type.enum.ts";
import { ComponentState } from "../component_state/component-state.ts";
import { CoreEntityUpdateCycle, type UpdateCycle, type UpdateCycleRunner } from './core-entiy-update-cycle.ts';
import { UpdateLoopError } from './update-loop-error.ts';

/**
 * Base Updater of any core entity. Handles automatic and manual update detection.
 * Integrates a loop detection to throw {@link UpdateLoopError} on to many continuous updates.
 * 
 * @internal
 */
export class CoreEntityUpdater {
    private static mStackCap: number = 100;
    private static mFrameTime: number = 100;

    /**
     * Stack cap for update loop detection. When the update stack exceeds this value, an UpdateLoopError is thrown.
     */
    public static get stackCap(): number {
        return CoreEntityUpdater.mStackCap;
    } set stackCap(pValue: number) {
        CoreEntityUpdater.mStackCap = pValue;
    }

    /**
     * Frame time for update reshedule. When a update takes longer than this value, it is resheduled to the next frame. Value in milliseconds.
     */
    public static get frameTime(): number {
        return CoreEntityUpdater.mFrameTime;
    } set frameTime(pValue: number) {
        CoreEntityUpdater.mFrameTime = pValue;
    }

    private readonly mInteractionZone: InteractionZone;
    private readonly mUpdateFunction: UpdateListener;
    private readonly mUpdateRunCache: WeakMap<UpdateCycleRunner, boolean>;
    private readonly mUpdateStates: UpdateInformation;
    private readonly mManualComponentState: ComponentState<Symbol>;

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

        // Init updater settings.
        this.mUpdateFunction = pParameter.onUpdate;

        // Create isolated or default zone from found parent interaction zone.
        this.mInteractionZone = pParameter.zone;
        this.mManualComponentState = new ComponentState<Symbol>(Symbol('Manual Update'));

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

        // Add listener for interactions. Shedules an update on interaction zone.
        this.mInteractionZone.addInteractionListener((pReason: InteractionZoneEvent<ComponentState>) => {
            // Only update on sets.
            if ((pReason.triggerType & ComponentStateType.set) === 0) {
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
        // Disconnect all listener.
        this.mInteractionZone.removeInteractionListener();
    }

    /**
     * Resolve promise after the update cycle completes.
     * Promise is rejected with any update error.
     * 
     * @returns true when anything was updated.
     */
    public async waitForUpdate(): Promise<boolean> {
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
    public executeInZone<T>(pFunction: () => T): T {
        return this.mInteractionZone.execute(pFunction);
    }

    /**
     * Manually start a synchron update.
     * When the update is called inside a asynchron update scope, it will minimize frame time overflows by resheduling this update.
     */
    public update(): boolean {
        // Create independend interaction event for manual shedule.
        const lManualUpdateEvent: InteractionZoneEvent<ComponentState> = new InteractionZoneEvent<ComponentState>(ComponentStateType.manual, this.mInteractionZone, this.mManualComponentState);

        // Run synchron update.
        return this.runUpdateSynchron(lManualUpdateEvent);
    }

    /**
     * Manually start a asynchron update.
     */
    public updateAsync(): void {
        // Create independend interaction event for manual shedule.
        const lManualUpdateEvent: InteractionZoneEvent<ComponentState> = new InteractionZoneEvent<ComponentState>(ComponentStateType.manual, this.mInteractionZone, this.mManualComponentState);

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
    private executeTaskChain(pUpdateTask: InteractionZoneEvent<ComponentState>, pUpdateCycle: UpdateCycle, pUpdateState: boolean, pStack: Array<InteractionZoneEvent<ComponentState>>): boolean {
        // Throw if too many calles were chained.
        if (pStack.length > CoreEntityUpdater.stackCap) {
            throw new UpdateLoopError('Call loop detected', pStack);
        }

        // Measure performance.
        const lStartPerformance = performance.now();

        // Reshedule task when frame time exceeds MAX_FRAME_TIME. Update called next frame.
        if (!pUpdateCycle.forcedSync && lStartPerformance - pUpdateCycle.startTime > CoreEntityUpdater.frameTime) {
            throw new UpdateResheduleError();
        }

        // Create and expand call chain when it was not resheduled.
        pStack.push(pUpdateTask);

        // Call task. If no other call was sheduled during this call, the length will be the same after. 
        const lUpdatedState: boolean = this.mInteractionZone.execute(() => {
            return this.mUpdateFunction.call(this);
        }) || pUpdateState;

        // Set new runner id after run through.
        // When the update function has resheduled, the resheduled cycle runs with the same runner id, bc of the error that skips this call.
        CoreEntityUpdateCycle.updateCycleRunId(pUpdateCycle, this);

        // Exit execution chain when no task is chained.
        if (!this.mUpdateStates.cycle.chainedTask) {
            return lUpdatedState;
        }

        // Buffer next running task and remove it from queue.
        const lNextTask: InteractionZoneEvent<ComponentState> = this.mUpdateStates.cycle.chainedTask;
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
    private runUpdateAsynchron(pUpdateTask: InteractionZoneEvent<ComponentState>, pResheduledCycle: UpdateCycle | null): void {
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
                CoreEntityUpdateCycle.openUpdateCycle({ updater: this, runSync: false }, lCycleUpdate);
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
    private runUpdateSynchron(pUpdateTask: InteractionZoneEvent<ComponentState>): boolean {
        // When the current update is running, save the most current update task as next update.
        if (this.mUpdateStates.sync.running) {
            this.mUpdateStates.cycle.chainedTask = pUpdateTask;
            return false;
        }

        // Set synchron update to running state.
        this.mUpdateStates.sync.running = true;

        // Try to request a sync update state.
        try {
            const lUpdateResult: boolean = CoreEntityUpdateCycle.openUpdateCycle({ updater: this, runSync: true }, (pUpdateCycle: UpdateCycle): boolean => {
                // Read from cache when the update was already run in a resheduled cycle.
                if (this.mUpdateRunCache.has(pUpdateCycle.runner)) {
                    // Update cycles start time when any update is used.
                    // Prevents very long updates from running into another reshedule without any real update called.
                    // This does remove the frame time guarantee but prevents endless loops.
                    CoreEntityUpdateCycle.updateCyleStartTime(pUpdateCycle);

                    // Read cache.
                    return this.mUpdateRunCache.get(pUpdateCycle.runner)!;
                }

                // Execute task.
                const lExecutionResult: boolean = this.executeTaskChain(pUpdateTask, pUpdateCycle, false, new Array<InteractionZoneEvent<ComponentState>>());

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

            // Release chain complete hooks.
            this.releaseUpdateChainCompleteHooks(false, pError);

            // Rethrow error 
            throw pError;

        } finally {
            // Set synchron update to finished running state.
            this.mUpdateStates.sync.running = false;
        }
    }
}

class UpdateResheduleError extends Error {
    /**
     * Constructor.
     */
    public constructor() {
        super(`Update resheduled`);
    }
}

type UpdateChainCompleteHookRelease = (pUpdated: boolean, pError: any) => void;

type UpdateInformation = {
    cycle: {
        chainedTask: InteractionZoneEvent<ComponentState> | null;
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
type UpdateListener = () => boolean;
type BaseCoreEntityUpdateZoneConstructorParameter = {
    /**
     * Debug label.
     */
    label: string;

    /**
     * Function executed on update.
     */
    onUpdate: UpdateListener;

    /**
     * Interaction zone.
     */
    zone: InteractionZone;
};

export type CoreEntityUpdaterInteractionData = {
    property: PropertyKey;
};