import { Exception } from '@kartoffelgames/core.data';
import { InteractionResponseType } from './enum/interaction-response-type.enum';
import { InteractionZone, } from './interaction-zone';

/**
 * Interaction reason. Information of a detected interaction.
 */
export class InteractionReason {
    private readonly mCatchType: InteractionResponseType;
    private mOrigin: InteractionZone | null;
    private readonly mProperty: PropertyKey | undefined;
    private readonly mSource: object;
    private readonly mStackError: Error;
    private readonly mTriggeredZones: WeakSet<InteractionZone>;

    /**
     * Get what type of interaction was detected.
     */
    public get interactionType(): InteractionResponseType {
        return this.mCatchType;
    }

    /**
     * Get reason dispatch origin.
     */
    public get origin(): InteractionZone {
        if (this.mOrigin === null) {
            throw new Exception('Interaction reason not dispatched.', this);
        }

        return this.mOrigin;
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
    public get stacktrace(): Error {
        return this.mStackError!;
    }

    /**
     * Constructor.
     * Creates a stacktrace from the point of creation.
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
        this.mOrigin = null;
        this.mTriggeredZones = new WeakSet<InteractionZone>();
    }

    /**
     * Add zone where reason was triggered in.
     * 
     * @param pZone - Interaction zone.
     * 
     * @throws {@link Exception} 
     * When a zone is already set.
     * 
     * @returns true when zone was not already set as triggered zone.
     * 
     * @internal
     */
    public addDispatchedZone(pZone: InteractionZone): boolean {
        // Skip zone set when zone was already triggered.
        if (this.mTriggeredZones.has(pZone)) {
            return true;
        }

        // Add zone to triggered zones and
        this.mTriggeredZones.add(pZone);
        return false;
    }

    /**
     * Set origin interaction zone of reason.
     * 
     * @param pInteractionStack - Origin zone.
     */
    public setOrigin(pInteractionStack: InteractionZone): void {
        this.mOrigin = pInteractionStack;
    }

    /**
     * Reason description as string.
     * 
     * @returns reason as string.
     */
    public toString(): string {
        // Find source name.
        let lSourceName: string = this.mSource.constructor.name;
        if (typeof this.mSource === 'function') {
            lSourceName = this.mSource.name;
        }

        // Add Propery when set.
        const lPropertyDescription: string = (this.mProperty) ? `[${this.mProperty.toString()}]` : '';


        return `${this.origin.name}: ${typeof this.mSource}:${lSourceName}${lPropertyDescription} -> ${InteractionResponseType[this.interactionType]}`;
    }
}