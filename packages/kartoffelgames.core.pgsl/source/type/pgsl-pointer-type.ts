import { PgslValueAddressSpace } from "../enum/pgsl-value-address-space.enum.ts";
import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";

// TODO: Rework pointer to be used as Pointer<Type, AddressSpace.Module>  ... Na i do it the way i intend to use it for now.

/**
 * Pointer type definition.
 * Represents a pointer type that references another type in memory.
 * Pointers allow indirect access to values and are used for referencing data.
 */
export class PgslPointerType extends PgslType {
    private readonly mReferencedType: PgslType;
    private mAssignedAddressSpace: PgslValueAddressSpace | null;

    /**
     * Gets the assigned address space for this pointer.
     * The address space defines where the pointer points to (e.g., function, module, etc.).
     * Defaults to a private address space.
     * 
     * @returns The assigned address space, or null if not yet assigned.
     */
    public get assignedAddressSpace(): PgslValueAddressSpace {
        return this.mAssignedAddressSpace ?? PgslValueAddressSpace.Module;
    }

    /**
     * Gets the type that this pointer references.
     * 
     * @returns The referenced type.
     */
    public get referencedType(): PgslType {
        return this.mReferencedType;
    }

    /**
     * Constructor for pointer type.
     * 
     * @param pTrace - The trace context for validation and error reporting.
     * @param pReferenceType - The type that this pointer references.
     */
    public constructor(pTrace: PgslTrace, pReferenceType: PgslType) {
        super(pTrace);

        // Set data.
        this.mReferencedType = pReferenceType;

        // No address space assigned yet.
        this.mAssignedAddressSpace = null;
    }

    public assignAddressSpace(pAddressSpace: PgslValueAddressSpace) {
        // When a address space is already assigned and the new one is different, report an error.
        if (this.mAssignedAddressSpace !== null && this.mAssignedAddressSpace !== pAddressSpace) {
            this.trace.pushIncident('Pointer address space is already assigned and cannot be changed');
            return;
        }

        this.mAssignedAddressSpace = pAddressSpace;
    }

    /**
     * Compare this pointer type with a target type for equality.
     * Two pointer types are equal if they reference the same type.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both pointers reference the same type.
     */
    public override equals(pTarget: PgslType): boolean {
        // Target type must be a pointer.
        if (!(pTarget instanceof PgslPointerType)) {
            return false;
        }

        return this.referencedType.equals(pTarget.referencedType);
    }

    /**
     * Check if this pointer type is explicitly castable into the target type.
     * Pointer types are never castable to other types.
     * 
     * @param _pTarget - Target type to check castability to.
     * 
     * @returns Always false - pointers cannot be cast.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // A pointer is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if this pointer type is implicitly castable into the target type.
     * Pointer types are never castable to other types.
     * 
     * @param _pTarget - Target type to check castability to.
     * 
     * @returns Always false - pointers cannot be cast.
     */
    public override isImplicitCastableInto(_pTarget: PgslType): boolean {
        // A pointer is never explicit nor implicit castable.
        return false;
    }

    /**
     * Collect type properties for pointer types.
     * Validates that the referenced type is storable and defines pointer characteristics.
     * 
     * @param pTrace - Trace context for validation and error reporting.
     * 
     * @returns Type properties for pointer types.
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