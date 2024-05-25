import { Exception } from '@kartoffelgames/core.data';
import { InteractionResponseType } from './enum/interaction-response-type.enum';
import { InteractionZone } from './interaction-zone';

/**
 * Interaction reason. Information of a detected interaction.
 */
export class InteractionReason {
    private readonly mCatchType: InteractionResponseType;
    private readonly mProperty: PropertyKey | undefined;
    private readonly mSource: object;
    private readonly mStackError: Error;
    private mZone: InteractionZone | null;

    /**
     * Get what type of interaction was detected.
     */
    public get interactionType(): InteractionResponseType {
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
     * Get zone of interaction.
     * 
     * @throws {@link Exception}
     * When zone is not set, reason was not dispatched.
     */
    public get zone(): InteractionZone {
        if (this.mZone === null) {
            throw new Exception('Interaction reason not dispatched.', this);
        }

        return this.mZone;
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
        this.mZone = null;
    }

    /**
     * Add zone where reason was triggered in.
     * 
     * @param pZone - Interaction zone.
     * 
     * @throws {@link Exception} 
     * When a zone is already set.
     * 
     * @internal
     */
    public setZone(pZone: InteractionZone): void {
        if (this.mZone !== null) {
            throw new Exception(`Can't add a static zone to interaction reason.`, this);
        }

        this.mZone = pZone;
    }
}