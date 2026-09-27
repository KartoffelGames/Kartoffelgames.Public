import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { BasePgslType, BasePgslTypeKind } from './base-pgsl-type.ts';

// TODO: Treat pointer addressspace as internal generic.
//       A user set pointer has no space restriction but a build in can.
//       For every called user function with a different pointer addressspace emit a different function "overload".
//       As a buildin doesnt get emitted, this doesnt take effect but the validation will be effective.

/**
 * Pointer type definition.
 * Represents a pointer type that references another type in memory.
 * Pointers allow indirect access to values and are used for referencing data.
 */
export class PgslPointerType extends BasePgslType {
    /**
     * Type names for pointer types.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            pointer: 'Pointer'
        } as const;
    }

    /**
     * Get a string identification for the type.
     *
     * @param pReferencedType - The type that the pointer references.
     *
     * @returns The type identification.
     */
    public static identifierOf(pReferencedType: BasePgslType): string {
        return PgslPointerType.typeName.pointer + '[' + pReferencedType.meta.typeName + ']';
    }

    // TODO: That needs to go.
    private mAssignedAddressSpace: PgslValueAddressSpace | null;

    /**
     * Gets the assigned address space for this pointer.
     * The address space defines where the pointer points to (e.g., function, module, etc.).
     * Defaults to a private address space.
     *
     * @returns The assigned address space, or null if not yet assigned.
     */
    public get assignedAddressSpace(): PgslValueAddressSpace {
        return this.mAssignedAddressSpace ?? PgslValueAddressSpace.Function;
    }

    /**
     * Gets the type that this pointer references.
     *
     * @returns The referenced type.
     */
    public get referencedType(): BasePgslType {
        return this.meta.generics![0];
    }

    /**
     * Constructor for pointer type.
     *
     * @param pReferencedType - The type that this pointer references.
     */
    public constructor(pReferencedType: BasePgslType) {
        // Everything a pointer is.
        const lTypeKind: BasePgslTypeKind = BasePgslTypeKind.Pointer | BasePgslTypeKind.Concrete | BasePgslTypeKind.Storable;

        // Create and use meta.
        super(lTypeKind, {
            typeName: PgslPointerType.identifierOf(pReferencedType),
            generics: [pReferencedType]
        });

        // No address space assigned yet.
        this.mAssignedAddressSpace = null;
    }

    /**
     * Assign an address space to this pointer type.
     *
     * @param pAddressSpace - Address space of pointer type.
     * @param pContext - Context.
     */
    public assignAddressSpace(pAddressSpace: PgslValueAddressSpace, pContext: AbstractSyntaxTreeContext): void {
        // When a address space is already assigned and the new one is different, report an error.
        if (this.mAssignedAddressSpace !== null && this.mAssignedAddressSpace !== pAddressSpace) {
            pContext.pushIncident('Pointer address space is already assigned and cannot be changed');
            return;
        }

        this.mAssignedAddressSpace = pAddressSpace;
    }

    /**
     * Get this types convertion rank to another type.
     * A pointer only converts into a pointer of the same referenced type.
     *
     * @param pTarget - Conversion target type.
     *
     * @returns Zero for the same pointer, infinity for anything else.
     */
    public override conversionRankTo(pTarget: BasePgslType): number {
        if (this.equals(pTarget)) {
            return 0;
        }

        return Number.POSITIVE_INFINITY;
    }

    /**
     * Compare this pointer type with a target type for equality.
     * Two pointer types are equal if they reference the same type.
     *
     * @param pTarget - Target comparison type.
     *
     * @returns True when both pointers reference the same type.
     */
    public override equals(pTarget: BasePgslType): pTarget is this {
        // Must both be a pointer.
        if (!this.isSameTypeClass(pTarget)) {
            return false;
        }

        return this.referencedType.equals(pTarget.referencedType);
    }
}
