import { InteractionZoneEvent } from './interaction-zone-event.ts';

/**
 * Merges execution zone and proxy tracking.
 */
export class InteractionZone {
    // Needs to be isolated to prevent parent listener execution.
    private static mCurrentZone: InteractionZone = new InteractionZone('Default');

    /**
     * Current execution zone.
     */
    public static get current(): InteractionZone {
        return InteractionZone.mCurrentZone;
    }

    /**
     * Create descendant of this zone.
     * 
     * @param pName - Name of new zone.
     * 
     * @returns new {@link InteractionZone} with zone as parent.
     */
    public static create(pName: string): InteractionZone {
        return new InteractionZone(pName);
    }

    private readonly mInteractionListener: Map<InteractionListener<object>, InteractionZone>;
    private readonly mName: string;
    private mTriggerFilterBitmap: number;

    /**
     * Get interaction detection name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Constructor.
     * Creates new interaction zone. Detects all asynchron executions inside execution zone.
     * Except IndexDB calls.
     * Listens on changes and function calls on registered objects.
     * Child changes triggers parent interaction zone but parent doesn't trigger child.
     * 
     * @param pName - Name of interaction zone.
     */
    private constructor(pName: string) {
        // Set name of zone. Used only for debugging and labeling.
        this.mName = pName;

        // Create Trigger and their listener list.
        this.mTriggerFilterBitmap = ~0; // All trigger allowed by default.
        this.mInteractionListener = new Map<InteractionListener<object>, InteractionZone>();
    }

    /**
     * Add listener for change events.
     * Ignores adding the same listener multiple times.
     * 
     * @param pListener - Listener.
     * 
     * @returns itself. 
     */
    public addInteractionListener<TData extends object>(pListener: InteractionListener<TData>): this {
        // Add listener to list
        this.mInteractionListener.set(pListener as InteractionListener<object>, InteractionZone.current);

        // Chainable.
        return this;
    }

    /**
     * set trigger restriction for this zone. Only events with matching trigger bitmap are dispatched to this zone.
     * Listener are not executed when bitmap is set to zero.
     * 
     * @param pTriggerBitmap - All allowed trigger bits as number.
     * 
     * @returns itself. 
     */
    public setTriggerRestriction(pTriggerBitmap: number): this {
        // Add or override trigger bitmap.
        this.mTriggerFilterBitmap = pTriggerBitmap;

        // Chainable.
        return this;
    }

    /**
     * Executes function in this execution zone.
     * 
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     * 
     * @returns result of execution.
     */
    public execute<T extends (...pArgs: Array<any>) => any>(pFunction: T, ...pArgs: Parameters<T>): ReturnType<T> {
        const lLastZone: InteractionZone = InteractionZone.mCurrentZone;

        // Set this zone as execution zone and execute function.
        InteractionZone.mCurrentZone = this;

        // Try to execute
        try {
            return pFunction(...pArgs);
        } finally {
            // Reset to last zone.
            InteractionZone.mCurrentZone = lLastZone;
        }
    }

    /**
     * Call all interaction listener of this zone with event.
     * Returns false when event was blocked by trigger filter bitmap.
     * 
     * @param pEvent - Interaction event.
     * 
     * @returns false when event was blocked by trigger filter bitmap true otherwise.
     */
    public pushInteraction(pTrigger: number, pData: object): boolean {
        // Block dispatch of reason when it does not match the response type bitmap.
        // Send it when it was passthrough from child zones.
        if ((this.mTriggerFilterBitmap & pTrigger) === 0) {
            return false;
        }

        // Skip dispatch when no listener is registered.
        if (this.mInteractionListener.size === 0) {
            return true;
        }

        const lInteractionEvent: InteractionZoneEvent<object> = new InteractionZoneEvent(pTrigger, this, pData);

        // Read interaction listener of interaction type.
        for (const [lListener, lZone] of this.mInteractionListener.entries()) {
            lZone.execute(() => {
                lListener.call(this, lInteractionEvent);
            });
        }

        return true;
    }

    /**
     * Remove listener for change events.
     * When no listener is specified. All listener of the type are removed.
     * 
     * @param pListener - Listener.
     * 
     * @returns itself.
     */
    public removeInteractionListener(pListener?: InteractionListener<object>): this {
        // Remove every listener of type.
        if (!pListener) {
            this.mInteractionListener.clear();

            // Chainable.
            return this;
        }

        // Remove single listener from type.
        this.mInteractionListener.delete(pListener);

        // Chainable.
        return this;
    }
}

export type InteractionListener<TData extends object> = (pReason: InteractionZoneEvent<TData>) => void;