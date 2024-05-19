import { InteractionResponseType } from './enum/interaction-response-type.enum';

/**
 * Interaction reason. Information of a detected interaction.
 */
export class InteractionReason {
    private readonly mCatchType: InteractionResponseType;
    private readonly mProperty: PropertyKey | undefined;
    private readonly mSource: object;
    private readonly mStackError: Error;

    /**
     * Get what type of interaction was detected.
     */
    public get catchType(): InteractionResponseType {
        return this.mCatchType;
    }

    /**
     * Get interacted property of source.
     * When the property is undefined, the source was changed directly.
     */
    public get property(): PropertyKey | undefined {
        return this.mProperty;
    }

    /**
     * Get source of interaction.
     */
    public get source(): object {
        return this.mSource;
    }

    /**
     * Get stack trace of interaction.
     */
    public get stacktrace(): string {
        return this.mStackError.stack!;
    }

    /**
     * Constructor.
     * Creates a stacktrace from the point of creation.s
     * 
     * @param pInteractionType - What type of interaction.
     * @param pSource - Object wich was interacted with.
     * @param pProperty - Optional change reason property.
     */
    public constructor(pInteractionType: InteractionResponseType, pSource: object, pProperty?: PropertyKey) {
        this.mCatchType = pInteractionType;
        this.mSource = pSource;
        this.mProperty = pProperty;
        this.mStackError = new Error();
    }
}