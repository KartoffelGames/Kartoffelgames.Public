import { InteractionZone, } from './interaction-zone.ts';

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
     * For what trigger this event was pushed.
     */
    public get trigger(): TType {
        return this.mInteractionTrigger;
    }

    /**
     * For what type this event was pushed.
     */
    public get type(): Enum<TType> {
        return this.mInteractionType;
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
        return `${this.origin.name} -> ${this.type[this.trigger]} - ${this.data.toString()}`;
    }
}

type Enum<T> = { [key: string]: T; };

export type InteractionEventTriggerType<T> = Enum<T | string>;