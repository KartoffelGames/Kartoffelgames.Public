import type { EnumDeclarationAst } from '../../declaration/enum-declaration-ast.ts';
import { BasePgslType, BasePgslTypeKind } from './base-pgsl-type.ts';

/**
 * Enum type.
 * Represents a user-defined enum type that contains multiple named values.
 */
export class PgslEnumType extends BasePgslType {
    /**
     * Type names for enum types.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            enum: 'Enum'
        } as const;
    }

    /**
     * Get a string identification for the type.
     *
     * @param pEnumDeclaration - Declaration of the enum type.
     *
     * @returns The type identification.
     */
    public static identifierOf(pEnumDeclaration: EnumDeclarationAst): string {
        return PgslEnumType.typeName.enum + '[' + pEnumDeclaration.name + ']';
    }

    private readonly mEnumName: string;

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
     * @param pEnumDeclaration - Declaration of the enum type.
     */
    public constructor(pEnumDeclaration: EnumDeclarationAst) {
        // Everything a enum is.
        let lTypeKind: BasePgslTypeKind = BasePgslTypeKind.Enum | BasePgslTypeKind.Composite | BasePgslTypeKind.FixedFootprint;

        // A enum is only concrete when its underlying type is.
        lTypeKind |= pEnumDeclaration.data.underlyingType.isKind(BasePgslTypeKind.Concrete) ? BasePgslTypeKind.Concrete : BasePgslTypeKind.None;

        // Create and use meta.
        super(lTypeKind, {
            typeName: PgslEnumType.identifierOf(pEnumDeclaration)
        });

        this.mEnumName = pEnumDeclaration.name;
    }

    /**
     * Get this types convertion rank to another type.
     * A enum only converts into the same enum.
     *
     * @param pTarget - Conversion target type.
     *
     * @returns Zero for the same enum, infinity for anything else.
     */
    public override conversionRankTo(pTarget: BasePgslType): number {
        if (this.equals(pTarget)) {
            return 0;
        }

        return Number.POSITIVE_INFINITY;
    }

    /**
     * Compare this enum type with a target type for equality.
     * Two enum types are equal if they have the same enum name.
     *
     * @param pTarget - Target comparison type.
     *
     * @returns True when both types have the same enum name.
     */
    public override equals(pTarget: BasePgslType): pTarget is this {
        // Must both be a enum.
        if (!this.isSameTypeClass(pTarget)) {
            return false;
        }

        return this.enumName === pTarget.enumName;
    }
}
