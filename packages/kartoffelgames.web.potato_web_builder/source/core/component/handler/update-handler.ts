import { List } from '@kartoffelgames/core.data';
import { IgnoreInteractionDetection, InteractionReason, InteractionResponseType, InteractionZone } from '@kartoffelgames/web.change-detection';
import { InteractionZoneStack } from '@kartoffelgames/web.change-detection/library/source/change_detection/interaction-zone';
import { UpdateTrigger } from '../../../enum/update-trigger.enum';
import { LoopDetectionHandler } from './loop-detection-handler';

/**
 * Component update handler. Handles automatic and manual updates.
 * Integrates with {@link LoopDetectionHandler} to detect update loops.
 * 
 * @internal
 */
@IgnoreInteractionDetection
export class UpdateHandler {
    private readonly mComponentZoneStack: InteractionZoneStack;
    private mEnabled: boolean;
    private readonly mInteractionDetectionListener: (pReason: InteractionReason) => void;
    private readonly mInteractionZone: InteractionZone;
    private readonly mLoopDetectionHandler: LoopDetectionHandler;
    private readonly mUpdateListener: List<UpdateListener>;

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
     * Get interaction stack of update handler.
     */
    public get interactionStack(): InteractionZoneStack {
        return this.mComponentZoneStack.clone();
    }

    /**
     * Constructor.
     * @param pUpdateScope - Update scope.
     */
    public constructor(pIsolatedInteraction: boolean, pInteractionTrigger: UpdateTrigger, pInteractionStack?: InteractionZoneStack) {
        this.mUpdateListener = new List<UpdateListener>();
        this.mEnabled = false;
        this.mLoopDetectionHandler = new LoopDetectionHandler(10);

        // Create isolated or default zone.
        this.mInteractionZone = new InteractionZone('CapsuledZone', { isolate: pIsolatedInteraction, trigger: <InteractionResponseType><unknown>pInteractionTrigger });

        // Shedule an update on interaction zone.
        this.mInteractionDetectionListener = (pReason: InteractionReason) => { this.sheduleUpdateTask(pReason); };

        // Add listener for interactions.
        this.mInteractionZone.addInteractionListener(this.mInteractionDetectionListener);

        // Save current component zone stack and push new interaction zone to it.
        // Truncate stack when interaction zone is isolated.
        this.mComponentZoneStack = InteractionZone.restore(pInteractionStack ?? InteractionZone.save(), () => {
            return this.mInteractionZone.execute(() => {
                return InteractionZone.save();
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
    public async update(): Promise<boolean> {
        const lReason: InteractionReason = new InteractionReason(InteractionResponseType.Custom, this, Symbol('Manual Update'));

        // Request update to dispatch change events on other components.
        this.requestUpdate(lReason);

        // Shedule an update task.
        return this.sheduleUpdateTask(lReason);
    }

    /**
     * Execute all update listener.
     */
    private dispatchUpdateListener(pReason: InteractionReason): void {
        // Call update listener in current zone.
        InteractionZone.restore(this.mComponentZoneStack, () => {
            // Trigger all update listener.
            for (const lListener of this.mUpdateListener) {
                lListener.call(this, pReason);
            }
        });
    }

    /**
     * Shedule asyncron update.
     * Triggers update handler asynchron.
     */
    private async sheduleUpdateTask(pReason: InteractionReason): Promise<boolean> {
        // Skip task shedule when update handler is disabled but release update waiter.
        if (!this.enabled) {
            return false;
        }

        // Shedule new asynchron update task.
        return this.mLoopDetectionHandler.sheduleTask(() => {
            // Call every update listener inside interaction zone.
            this.dispatchUpdateListener(pReason);
        }, pReason).then(() => true);
    }
}

export type UpdateListener = (pReason: InteractionReason) => void;
