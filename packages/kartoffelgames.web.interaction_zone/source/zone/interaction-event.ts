import { InteractionZone, } from './interaction-zone';

/**
 * Interaction event. Information of a pushed interaction.
 */
export class InteractionEvent<TType extends number, TData extends object = object> {
    private readonly mData: TData;
    private readonly mInteractionTrigger: TType;
    private readonly mInteractionType: Enum<TType>;
    private readonly mOrigin: InteractionZone;
    private readonly mStackError: Error;

    /**
     * Get data of interaction event.
     */
    public get data(): TData {
        return this.mData;
    }

    /**
     * Get what interaction trigger was pushed.
     */
    public get interactionTrigger(): TType {
        return this.mInteractionTrigger;
    }

    /**
     * Get what type of interaction was pushed.
     */
    public get interactionType(): Enum<TType> {
        return this.mInteractionType;
    }

    /**
     * Get event zone origin.
     */
    public get origin(): InteractionZone {
        return this.mOrigin;
    }

    /**
     * Get stack trace of interaction.
     */
    public get stacktrace(): Error {
        return this.mStackError!;
    }

    /**
     * Constructor.
     * Creates a stacktrace from the point of creation.
     * 
     * @param pInteractionType - Type of event.
     * @param pInteractionTrigger - Trigger filter of event. Used as bitmap in zones.
     * @param pOrigin - Zone where this event will be pushed first or is originated from.
     * @param pData - Optional user data.
     */
    public constructor(pInteractionType: InteractionEventTriggerType<TType>, pInteractionTrigger: TType, pOrigin: InteractionZone, pData: TData) {
        // User data.
        this.mInteractionType = pInteractionType as Enum<TType>;
        this.mInteractionTrigger = pInteractionTrigger;
        this.mData = pData;

        // Zone data.
        this.mStackError = new Error();
        this.mOrigin = pOrigin;
    }

    /**
     * Event description as string.
     * 
     * @returns Event as string.
     */
    public toString(): string {
        return `${this.origin.name} -> ${this.interactionType}:${this.interactionTrigger} - ${this.data.toString()}`;
    }
}

type Enum<T> = { [key: string]: T; };

export type InteractionEventTriggerType<T> = Enum<T | string>;