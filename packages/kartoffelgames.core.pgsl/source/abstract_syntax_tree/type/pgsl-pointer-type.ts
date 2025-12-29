import { TypeCst } from "../../concrete_syntax_tree/general.type.ts";
import { PgslValueAddressSpace } from '../../enum/pgsl-value-address-space.enum.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from "../abstract-syntax-tree.ts";
import { IType, type TypeProperties } from './i-type.interface.ts';

/**
 * Pointer type definition.
 * Represents a pointer type that references another type in memory.
 * Pointers allow indirect access to values and are used for referencing data.
 */
export class PgslPointerType extends AbstractSyntaxTree<TypeCst, TypeProperties> implements IType {
    private mAssignedAddressSpace: PgslValueAddressSpace | null;
    private readonly mReferencedType: IType;

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
    public get referencedType(): IType {
        return this.mReferencedType;
    }

    /**
     * Constructor for pointer type.
     * 
     * @param pContext - The context for validation and error reporting.
     * @param pReferenceType - The type that this pointer references.
     */
    public constructor(pReferenceType: IType) {
        super({ type: 'Type', range: [0, 0, 0, 0] });

        // Set data.
        this.mReferencedType = pReferenceType;

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
     * Compare this pointer type with a target type for equality.
     * Two pointer types are equal if they reference the same type.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both pointers reference the same type.
     */
    public equals(pTarget: IType): boolean {
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
    public isExplicitCastableInto(_pTarget: IType): boolean {
        // A pointer is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if this pointer type is implicitly castable into the target type.
     * Pointer types are never castable to other types.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns Always false - pointers cannot be cast.
     */
    public isImplicitCastableInto(pTarget: IType): boolean {
        // A pointer is never explicit nor implicit castable.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for pointer types.
     * Validates that the referenced type is storable and defines pointer characteristics.
     * 
     * @param pContext - Trace context for validation and error reporting.
     * 
     * @returns Type properties for pointer types.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): TypeProperties {
        // Only storable types can be referenced by pointers.
        if (!this.mReferencedType.data.storable) {
            pContext.pushIncident('Referenced types of pointers need to be storable');
        }

        // Build meta types.
        const lMetaTypeList: Array<string> = new Array<string>();
        for (const metaType of this.mReferencedType.data.metaTypes) {
            lMetaTypeList.push(`Pointer<${metaType}>`);
        }

        return {
            // Meta information.
            metaTypes: lMetaTypeList,

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