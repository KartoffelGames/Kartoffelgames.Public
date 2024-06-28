import { InteractionZone, } from './interaction-zone';

/**
 * Interaction reason. Information of a detected interaction.
 */
export class InteractionReason { // TODO: Rename to InteractionEvent. Make it generic. Remove Property and source (Put it inside event data or so.)
    private readonly mOrigin: InteractionZone;
    private readonly mProperty: PropertyKey | undefined;
    private readonly mSource: object;
    private readonly mStackError: Error;
    private readonly mTriggerType: number;
    private readonly mTriggeredZones: WeakSet<InteractionZone>;

    /**
     * Get reason dispatch origin.
     */
    public get origin(): InteractionZone {
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
     * Get what type of interaction was detected.
     */
    public get triggerType(): number {
        return this.mTriggerType;
    }

    /**
     * Constructor.
     * Creates a stacktrace from the point of creation.
     * 
     * @param pInteractionType - What type of interaction.
     * @param pSource - Object wich was interacted with.
     * @param pProperty - Optional change reason property.
     */
    public constructor(pInteractionType: number, pSource: object, pProperty: PropertyKey | undefined, pOrigin: InteractionZone) {
        this.mTriggerType = pInteractionType;
        this.mSource = pSource;
        this.mProperty = pProperty;
        this.mStackError = new Error();
        this.mOrigin = pOrigin;
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


        return `${this.origin.name}: ${typeof this.mSource}:${lSourceName}${lPropertyDescription} -> ${this.triggerType}`;
    }
}