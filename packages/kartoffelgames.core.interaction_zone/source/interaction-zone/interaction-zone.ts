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
        return new InteractionZone(pName, InteractionZone.current);
    }

    private readonly mAttachments: WeakMap<symbol, any>;
    private readonly mInteractionListener: Map<InteractionListener<object>, InteractionZone>;
    private readonly mName: string;
    private readonly mParent: InteractionZone | null;
    private mTriggerFilterBitmap: number;

    /**
     * Get interaction detection name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Parent zone this zone was created in.
     * The default zone has no parent.
     */
    public get parent(): InteractionZone | null {
        return this.mParent;
    }

    /**
     * Constructor.
     * Creates new interaction zone. Detects all asynchron executions inside execution zone.
     * Except IndexDB calls.
     * Listens on changes and function calls on registered objects.
     * Child changes triggers parent interaction zone but parent doesn't trigger child.
     * 
     * @param pName - Name of interaction zone.
     * @param pParent - Parent zone the new zone is created in.
     */
    private constructor(pName: string, pParent: InteractionZone | null = null) {
        // Set name of zone. Used only for debugging and labeling.
        this.mName = pName;

        // Set parent zone.
        this.mParent = pParent;

        // Create Trigger and their listener list.
        this.mTriggerFilterBitmap = ~0; // All trigger allowed by default.
        this.mInteractionListener = new Map<InteractionListener<object>, InteractionZone>();

        // Create empty attachment map.
        this.mAttachments = new WeakMap<symbol, any>();
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
     * Read an attachment value of this zone.
     * When the attachment is not set on this zone, the parent zone hierarchy is searched recursively.
     *
     * @param pKey - Attachment key.
     *
     * @returns attachment value or undefined when it is not set in this zones hierarchy.
     */
    public getAttachment<T>(pKey: symbol): T | null {
        // Return attachment value of this zone when it is set.
        if (this.mAttachments.has(pKey)) {
            return this.mAttachments.get(pKey) as T;
        }

        // Search the attachment value in the parent zone hierarchy.
        if (this.mParent !== null) {
            return this.mParent.getAttachment<T>(pKey);
        }

        // Return undefined when the attachment is not set in this zones hierarchy.
        return null;
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

    /**
     * Set an attachment value on this zone.
     *
     * @param pKey - Attachment key.
     * @param pValue - Attachment value.
     */
    public setAttachment<T>(pKey: symbol, pValue: T): void {
        // Add attachment value to this zones attachment map.
        this.mAttachments.set(pKey, pValue);
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
}

export type InteractionListener<TData extends object> = (pReason: InteractionZoneEvent<TData>) => void;