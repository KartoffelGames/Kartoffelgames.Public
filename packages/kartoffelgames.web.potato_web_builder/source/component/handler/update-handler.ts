import { List } from '@kartoffelgames/core.data';
import { IgnoreInteractionDetection, InteractionReason, InteractionResponseType, InteractionZone } from '@kartoffelgames/web.change-detection';
import { UpdateMode } from '../../enum/update-mode.enum';
import { LoopDetectionHandler } from './loop-detection-handler';
import { InteractionZoneStack } from '@kartoffelgames/web.change-detection/library/source/change_detection/interaction-zone';

/**
 * Component update handler. Handles automatic and manual updates.
 * Integrates with {@link LoopDetectionHandler} to detect update loops.
 * 
 * @internal
 */
@IgnoreInteractionDetection
export class UpdateHandler {
    private static readonly mDefaultComponentTrigger: InteractionResponseType = InteractionResponseType.CallbackCallEnd | InteractionResponseType.Custom | InteractionResponseType.EventlistenerEnd | InteractionResponseType.NativeFunctionCall | InteractionResponseType.FunctionCallEnd | InteractionResponseType.PromiseReject | InteractionResponseType.PromiseResolve | InteractionResponseType.PropertyDeleteEnd | InteractionResponseType.PropertySetEnd;

    private readonly mComponentZoneStack: InteractionZoneStack;
    private mEnabled: boolean;
    private readonly mInteractionDetectionListener: (pReason: InteractionReason) => void;
    private readonly mInteractionZone: InteractionZone;
    private readonly mLoopDetectionHandler: LoopDetectionHandler;
    private readonly mUpdateListener: List<UpdateListener>;
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
    public constructor(pUpdateScope: UpdateMode) {
        this.mUpdateListener = new List<UpdateListener>();
        this.mEnabled = false;
        this.mUpdateWaiter = new List<UpdateWaiter>();
        this.mLoopDetectionHandler = new LoopDetectionHandler(10);

        // Create isolated or default zone.
        if (pUpdateScope % UpdateMode.Isolated !== 0) {
            // Isolated zone.
            this.mInteractionZone = new InteractionZone('CapsuledComponentZone', { isolate: true, trigger: UpdateHandler.mDefaultComponentTrigger });
        } else {
            // Global zone.
            this.mInteractionZone = new InteractionZone('DefaultComponentZone', { trigger: UpdateHandler.mDefaultComponentTrigger });
        }

        // Create manual or default listener. Manual listener does nothing on interaction.
        if (pUpdateScope % UpdateMode.Manual !== 0) {
            // Empty change listener.
            this.mInteractionDetectionListener = () => {/* Empty */ };
        } else {
            // Shedule an update on interaction zone.
            this.mInteractionDetectionListener = (pReason: InteractionReason) => { this.sheduleUpdateTask(pReason); };
        }

        // Save current component zone stack.
        this.mComponentZoneStack = this.mInteractionZone.execute(() => {
            // Add listener for interactions inside interaction zone.
            this.mInteractionZone.addInteractionListener(this.mInteractionDetectionListener);

            return InteractionZone.save();
        });


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
        const lSilentZone: InteractionZone = new InteractionZone('Silent-' + this.mInteractionZone.name, { trigger: InteractionResponseType.None });

        // Call function in custom zone in current component stack.
        return InteractionZone.restore(this.mComponentZoneStack, () => {
            return lSilentZone.execute(pFunction);
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
        return InteractionZone.restore(this.mComponentZoneStack, pFunction);
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
    public excludeInteractionTrigger<T>(pFunction: () => T, pTrigger: InteractionResponseType): T {
        // Exclude trigger by AND a Negated pTrigger => 1010 & ~0010 => 1010 & 1101 => 1000
        const lCustomZone: InteractionZone = new InteractionZone('Custom-' + this.mInteractionZone.name, { trigger: UpdateHandler.mDefaultComponentTrigger & ~pTrigger });

        // Call function in custom zone in current component stack.
        return InteractionZone.restore(this.mComponentZoneStack, () => {
            return lCustomZone.execute(pFunction);
        });
    }

    /**
     * Register object and pass on update events.
     * 
     * @param pObject - Object.
     */
    public registerObject<T extends object>(pObject: T): T {
        return InteractionZone.restore(this.mComponentZoneStack, () => {
            return InteractionZone.registerObject(pObject);
        });
    }

    /**
     * Request update by sending an update request to the interaction zone.
     * Does nothing when the component is set to be {@link UpdateMode.Manual}
     * 
     * @param pReason - Update reason. Description of changed state.
     */
    public requestUpdate(pReason: InteractionReason): void {
        InteractionZone.restore(this.mComponentZoneStack, () => {
            InteractionZone.dispatchInteractionEvent(pReason);
        });
    }

    /**
     * Manual update component.
     * 
     * @public
     */
    public update(): void {
        const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Custom, this, Symbol('Manual Update'));
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
        // Shedule task in component zone stack.
        InteractionZone.restore(this.mComponentZoneStack, () => {
            // Skip task shedule when update handler is disabled but release update waiter.
            if (!this.enabled) {
                this.releaseWaiter();
                return;
            }

            // Shedule new asynchron update task.
            this.mLoopDetectionHandler.sheduleTask(() => {
                // Call every update listener inside interaction zone.
                this.dispatchUpdateListener(pReason);

                // Check if all changes where made during the listener calls and release all waiter when all updates where finished. 
                // When a new changes where made, the loop detection has another sheduled update.
                if (!this.mLoopDetectionHandler.hasActiveTask) {
                    this.releaseWaiter();
                }
            }, pReason);
        });
    }
}

type UpdateWaiter = (pError?: any) => void;
export type UpdateListener = (pReason: InteractionReason) => void;
