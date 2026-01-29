import type { TypeCst } from '../../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';
import type { EnumDeclarationAst } from '../declaration/enum-declaration-ast.ts';
import type { IType, TypeProperties } from './i-type.interface.ts';

/**
 * Enum type.
 * Represents a user-defined enum type that contains multiple named values.
 * Enum types are composite types that can be used to group related data.
 */
export class PgslEnumType extends AbstractSyntaxTree<TypeCst, TypeProperties> implements IType {
    private mEnumDeclaration: EnumDeclarationAst | null;
    private readonly mEnumName: string;
    private readonly mShadowedType: IType;

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
     * The type that is being shadowed.
     * If it does not shadow another type, it is itself.
     */
    public get shadowedType(): IType {
        return this.mShadowedType;
    }

    /**
     * Constructor for enum type.
     * 
     * @param pEnumName - The name of the enum type.
     * @param pShadowedType - Type that is the actual type of this.
     */
    public constructor(pEnumName: string, pShadowedType?: IType) {
        super({ type: 'Type', range: [0, 0, 0, 0] });

        // Set data.
        this.mShadowedType = pShadowedType ?? this;
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
    public equals(pTarget: IType): boolean {
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
    public isExplicitCastableInto(_pTarget: IType): boolean {
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
    public isImplicitCastableInto(pTarget: IType): boolean {
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
    protected override onProcess(pContext: AbstractSyntaxTreeContext): TypeProperties {
        // Read enum declaration.
        this.mEnumDeclaration = pContext.getEnum(this.mEnumName) ?? null;

        // Read enum trace information.
        if (!this.mEnumDeclaration) {
            pContext.pushIncident(`Name '${this.mEnumName}' does not resolve to a enum declaration.`);
        }

        return {
            // Meta information.
            metaTypes: [`Enum-${this.mEnumName}`],

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