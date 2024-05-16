import { DetectionCatchType } from './enum/detection-catch-type.enum';

export class ChangeReason {
    private readonly mCatchType: DetectionCatchType;
    private readonly mProperty: PropertyKey | undefined;
    private readonly mSource: object;
    private readonly mStackError: Error;

    /**
     * Get what type of change was detected.
     */
    public get catchType(): DetectionCatchType {
        return this.mCatchType;
    }

    /**
     * Get changed property of source.
     * When the property is undefined, the source was changed directly.
     */
    public get property(): PropertyKey | undefined {
        return this.mProperty;
    }

    /**
     * Get source of change.
     */
    public get source(): object {
        return this.mSource;
    }

    /**
     * Get stack trace of detected change.
     */
    public get stacktrace(): string {
        return this.mStackError.stack!;
    }

    /**
     * Constructor.
     * Creates a stacktrace from the point of creation.s
     * 
     * @param pCatchType - What type of change was detected.
     * @param pSource - Change reason object.
     * @param pProperty - Optional change reason property.
     */
    public constructor(pCatchType: DetectionCatchType, pSource: object, pProperty?: PropertyKey) {
        this.mCatchType = pCatchType;
        this.mSource = pSource;
        this.mProperty = pProperty;
        this.mStackError = new Error();
    }
}