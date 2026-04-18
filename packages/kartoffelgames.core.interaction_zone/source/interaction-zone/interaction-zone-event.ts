import type { InteractionZone } from './interaction-zone.ts';

/**
 * Interaction event. Information of a pushed interaction.
 */
export class InteractionZoneEvent<TData extends object = object> {
    private readonly mData: TData;
    private readonly mInteractionType: number;
    private readonly mOrigin: InteractionZone;

    /**
     * Get data of interaction event.
     */
    public get data(): TData {
        return this.mData;
    }

    /**
     * Get event zone origin.
     */
    public get origin(): InteractionZone {
        return this.mOrigin;
    }

    /**
     * For what trigger this event was pushed.
     */
    public get triggerType(): number {
        return this.mInteractionType;
    }

    /**
     * Constructor.
     * Creates a stacktrace from the point of creation.
     * 
     * @param pInteractionType - Trigger filter of event. Used as bitmap in zones.
     * @param pOrigin - Zone where this event will be pushed first or is originated from.
     * @param pData - Optional user data.
     */
    public constructor(pInteractionType: number, pOrigin: InteractionZone, pData: TData) {
        // User data.
        this.mInteractionType = pInteractionType;
        this.mData = pData;

        // Zone data.
        this.mOrigin = pOrigin;
    }
}
