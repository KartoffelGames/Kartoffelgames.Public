import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import type { EnumDeclarationAst } from '../declaration/enum-declaration-ast.ts';
import { PgslType, type PgslTypeProperties } from './pgsl-type.ts';

/**
 * Enum type.
 * Represents a user-defined enum type that contains multiple named values.
 * Enum types are composite types that can be used to group related data.
 */
export class PgslEnumType extends PgslType {
    private mEnumDeclaration: EnumDeclarationAst | null;
    private readonly mEnumName: string;

    /**
     * Gets the enum declaration AST node associated with this enum type.
     * 
     * @returns The enum declaration AST node, or null if not found.
     */
    public get enumDeclaration(): EnumDeclarationAst | null {
        return this.mEnumDeclaration;
    }

    /**
     * Gets the name of the enum type.
     * 
     * @returns The enum name.
     */
    public get enumName(): string {
        return this.mEnumName;
    }

    /**
     * Constructor for enum type.
     * 
     * @param pContext - The context for validation and error reporting.
     * @param pEnumName - The name of the enum type.
     */
    public constructor(pEnumName: string) {
        super();

        // Set data.
        this.mEnumName = pEnumName;

        // Read enum declaration.
        this.mEnumDeclaration = null;
    }

    /**
     * Compare this enum type with a target type for equality.
     * Two enum types are equal if they have the same enum name.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same struct name.
     */
    public override equals(pTarget: PgslType): boolean {
        // Must both be a enum.
        if (!(pTarget instanceof PgslEnumType)) {
            return false;
        }

        return this.enumName === pTarget.enumName;
    }

    /**
     * Check if this enum type is explicitly castable into the target type.
     * Enum types are never castable to other types.
     * 
     * @param _pTarget - Target type to check castability to.
     * 
     * @returns Always false - enums cannot be cast.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // A enum is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if this enum type is implicitly castable into the target type.
     * Enum types are never castable to other types.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns Always false - enums cannot be cast.
     */
    public override isImplicitCastableInto(pTarget: PgslType): boolean {
        // A enum is only castable to itself.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for enum types.
     * Validates that the enum exists and aggregates properties from all enum fields.
     * 
     * @param pContext - Context for validation and error reporting.
     * 
     * @returns Type properties aggregated from enum fields.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): PgslTypeProperties {
        // Read enum declaration.
        this.mEnumDeclaration = pContext.getEnum(this.mEnumName) ?? null;

        // Read enum trace information.
        if (!this.mEnumDeclaration) {
            pContext.pushIncident(`Name '${this.mEnumName}' does not resolve to a enum declaration.`);
        }

        return {
            // Default enum information.
            composite: true,
            indexable: false,
            storable: false,
            scalar: false,
            concrete: this.mEnumDeclaration?.data.underlyingType.data.concrete ?? false,
            plain: false,
            hostShareable: false,
            constructible: false,
            fixedFootprint: true,
        };
    }
}