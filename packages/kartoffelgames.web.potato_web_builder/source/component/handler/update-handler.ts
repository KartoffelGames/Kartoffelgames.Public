import { List } from '@kartoffelgames/core.data';
import { InteractionZone, InteractionReason, InteractionResponseType } from '@kartoffelgames/web.change-detection';
import { UpdateScope } from '../../enum/update-scope.enum';
import { LoopDetectionHandler } from './loop-detection-handler';

/**
 * Component update handler. Handles automatic and manual updates.
 * Integrates with {@link LoopDetectionHandler} to detect update loops.
 * 
 * @internal
 */
export class UpdateHandler {
    private mEnabled: boolean;
    private readonly mInteractionDetectionListener: (pReason: InteractionReason) => void;
    private readonly mInteractionZone: InteractionZone;
    private readonly mLoopDetectionHandler: LoopDetectionHandler;
    private readonly mUpdateListener: List<UpdateListener>;
    private readonly mUpdateScope: UpdateScope;
    private readonly mUpdateWaiter: List<UpdateWaiter>;

    /**
     * Get enabled state of update handler.
     * Does not report any updates on disabled state.
     */
    public get enabled(): boolean {
        return this.mEnabled;
    }

    /**
     * Get enabled state of update handler.
     * Does not report any updates on disabled state.
     */
    public set enabled(pEnabled: boolean) {
        this.mEnabled = pEnabled;
    }

    /**
     * Get interaction zone of update handler.
     */
    public get interactionZone(): InteractionZone {
        return this.mInteractionZone;
    }

    /**
     * Constructor.
     * @param pUpdateScope - Update scope.
     */
    public constructor(pUpdateScope: UpdateScope) {
        this.mUpdateScope = pUpdateScope;
        this.mUpdateListener = new List<UpdateListener>();
        this.mEnabled = false;
        this.mUpdateWaiter = new List<UpdateWaiter>();
        this.mLoopDetectionHandler = new LoopDetectionHandler(10);

        // Create new interaction zone if component is not inside interaction zone or mode is capsuled.
        switch (this.mUpdateScope) {
            case UpdateScope.Manual: {
                // Manual zone outside every other zone.
                this.mInteractionZone = new InteractionZone('ManualCapsuledComponentZone', { isolate: true, trigger: InteractionResponseType.None });

                // Empty change listener.
                this.mInteractionDetectionListener = () => {/* Empty */ };

                break;
            }

            case UpdateScope.Capsuled: {
                // New zone exclusive for this component.
                this.mInteractionZone = new InteractionZone('CapsuledComponentZone', { isolate: true, trigger: InteractionResponseType.Any });

                // Shedule an update on interaction zone.
                this.mInteractionDetectionListener = (pReason: InteractionReason) => { this.sheduleUpdateTask(pReason); };

                break;
            }

            case UpdateScope.Global: {
                // Reuse current zone
                this.mInteractionZone = new InteractionZone('DefaultComponentZone', { trigger: InteractionResponseType.Any });

                // Shedule an update on interaction zone.
                this.mInteractionDetectionListener = (pReason: InteractionReason) => { this.sheduleUpdateTask(pReason); };

                break;
            }
        }

        // Add listener for interactions inside interaction zone.
        this.mInteractionZone.addInteractionListener(this.mInteractionDetectionListener);

        // Define error handler.
        this.mLoopDetectionHandler.onError = (pError: any) => {
            // Supress error of any waiter were waiting.
            // Error should be handled by the async waiter.
            this.releaseWaiter(pError);
        };
    }

    /**
     * Listen for updates.
     * @param pListener - Listener.
     */
    public addUpdateListener(pListener: UpdateListener): void {
        this.mUpdateListener.push(pListener);
    }

    /**
     * Execute function with custom interaction trigger.
     * 
     * @param pFunction - Function.
     * @param pTrigger - Interaction detection trigger.
     * 
     * @remarks 
     * Nesting {@link disableInteractionTrigger} and {@link enableInteractionTrigger} is allowed.
     */
    public customInteractionTrigger<T>(pFunction: () => T, pTrigger: InteractionResponseType): T {
        return this.mInteractionZone.execute(() => {
            return new InteractionZone('Custom-' + this.mInteractionZone.name, { trigger: pTrigger }).execute(pFunction);
        });
    }

    /**
     * Deconstruct update handler. 
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
     * Execute function that does not trigger any interactions.
     * 
     * @param pFunction - Function.
     * 
     * @remarks 
     * Nesting {@link disableInteractionTrigger} and {@link enableInteractionTrigger} is allowed.
     */
    public disableInteractionTrigger<T>(pFunction: () => T): T {
        return this.mInteractionZone.execute(() => {
            return new InteractionZone('Silent-' + this.mInteractionZone.name, { trigger: InteractionResponseType.None }).execute(pFunction);
        });
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
        return this.mInteractionZone.execute(() => {
            return InteractionZone.registerObject(pObject);
        });
    }

    /**
     * Request update by sending an update request to the interaction zone.
     * Does nothing when the component is set to be {@link UpdateScope.Manual}
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
    public update(): void {
        const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Any, this, Symbol('Manual Update'));
        // Request update to dispatch change events on other components.
        this.requestUpdate(lReason);
        // Shedule an update task.
        this.sheduleUpdateTask(lReason);
    }

    /**
     * Wait for the component update.
     * Returns Promise<false> if there is currently no update cycle.
     */
    public async waitForUpdate(): Promise<boolean> {
        if (!this.mLoopDetectionHandler.hasActiveTask) {
            return false;
        }

        // Add new callback to waiter line.
        return new Promise<boolean>((pResolve: (pValue: boolean) => void, pReject: (pError: any) => void) => {
            this.mUpdateWaiter.push((pError: any) => {
                if (pError) {
                    // Reject if any error exist.
                    pReject(pError);
                } else {
                    // Is resolved when all data were updated.
                    pResolve(true);
                }
            });
        });
    }

    /**
     * Execute all update listener.
     */
    private dispatchUpdateListener(pReason: InteractionReason): void {
        // Trigger all update listener.
        for (const lListener of this.mUpdateListener) {
            lListener.call(this, pReason);
        }
    }

    /**
     * Release all update waiter.
     * Pass on any thrown error to all waiter callbacks.
     * 
     * @param pError - Error object.
     * @returns if any waiter were waiting.
     */
    private releaseWaiter(pError?: any): boolean {
        const lWaiterExist: boolean = this.mUpdateWaiter.length > 0;

        // Release all waiter.
        for (const lUpdateWaiter of this.mUpdateWaiter) {
            lUpdateWaiter(pError);
        }

        // Clear waiter list.
        this.mUpdateWaiter.clear();

        return lWaiterExist;
    }

    /**
     * Shedule asyncron update.
     * Triggers update handler asynchron.
     */
    private sheduleUpdateTask(pReason: InteractionReason): void {
        // Skip task shedule when update handler is disabled but release update waiter.
        if (!this.enabled) {
            this.releaseWaiter();
            return;
        }

        // Shedule new asynchron update task.
        this.mLoopDetectionHandler.sheduleTask(() => {
            // Call every update listener inside interaction zone.
            this.mInteractionZone.execute(() => {
                this.dispatchUpdateListener(pReason);
            });

            // Check if all changes where made during the listener calls and release all waiter when all updates where finished. 
            // When a new changes where made, the loop detection has another sheduled update.
            if (!this.mLoopDetectionHandler.hasActiveTask) {
                this.releaseWaiter();
            }
        }, pReason);
    }
}

type UpdateWaiter = (pError?: any) => void;
export type UpdateListener = (pReason: InteractionReason) => void;
