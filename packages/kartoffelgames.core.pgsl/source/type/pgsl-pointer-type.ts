import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";

// TODO: Rework pointer to be used as Pointer<Type, AddressSpace.Module>  ... Na i do it the way i intend to use it for now.

/**
 * Pointer type definition.
 * Represents a pointer type that references another type.
 */
export class PgslPointerType extends PgslType {
    private readonly mReferencedType: PgslType;

    /**
     * Referenced type of pointer.
     */
    public get referencedType(): PgslType {
        return this.mReferencedType;
    }

    /**
     * Constructor.
     * 
     * @param pTrace - The trace context.
     * @param pReferenceType - References type of pointer.
     */
    public constructor(pTrace: PgslTrace, pReferenceType: PgslType) {
        super(pTrace);

        // Set data.
        this.mReferencedType = pReferenceType;
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both share the same comparison type.
     */
    public override equals(pTarget: PgslType): boolean {
        // Target type must be a pointer.
        if (!(pTarget instanceof PgslPointerType)) {
            return false;
        }

        return this.referencedType.equals(pTarget.referencedType);
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // A pointer is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    public override isImplicitCastableInto(_pTarget: PgslType): boolean {
        // A pointer is never explicit nor implicit castable.
        return false;
    }

    /**
     * Collect type properties for pointer type.
     * 
     * @param pTrace - Trace context.
     * 
     * @returns Type properties for pointer type.
     */
    protected override onTypePropertyCollection(pTrace: PgslTrace): PgslTypeProperties {
        // Only storable types can be referenced by pointers.
        if (!this.mReferencedType.storable) {
            pTrace.pushIncident('Referenced types of pointers need to be storable');
        }

        return {
            composite: false,
            indexable: false,
            storable: true,
            hostShareable: false,
            constructible: false,
            fixedFootprint: false,
            concrete: true,
            scalar: false,
            plain: false
        };
    }
}