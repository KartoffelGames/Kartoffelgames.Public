import { BasePgslType, BasePgslTypeKind, BasePgslTypeMeta } from "./base-pgsl-type.ts";

/**
 * Numeric type definition.
 * Represents all numeric types in PGSL including integers, floats, and abstract numeric types.
 * Handles type casting rules between different numeric types.
 */
export class PgslNumericType extends BasePgslType {
    /**
     * Type names for all available numeric types.
     * Maps numeric type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            signedInteger: 'int',
            unsignedInteger: 'uint',
            float16: 'float16',
            float32: 'float',
            abstractFloat: '*AbstractFloat*', // Should never be written
            abstractInteger: '*AbstractInteger*' // Should never be written
        } as const;
    }

    /**
     * Conversions table between numeric types for abstract types..
     * Must be under the typeName declaration to avoid initialization order issues.
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    private static readonly CONVERSION_RANKS: ReadonlyMap<PgslNumericTypeName, ReadonlyMap<PgslNumericTypeName, number>> = new Map<PgslNumericTypeName, ReadonlyMap<PgslNumericTypeName, number>>([
        [PgslNumericType.typeName.abstractFloat, new Map<PgslNumericTypeName, number>([
            [PgslNumericType.typeName.float32, 1],
            [PgslNumericType.typeName.float16, 2]
        ])],
        [PgslNumericType.typeName.abstractInteger, new Map<PgslNumericTypeName, number>([
            [PgslNumericType.typeName.signedInteger, 3],
            [PgslNumericType.typeName.unsignedInteger, 4],
            [PgslNumericType.typeName.abstractFloat, 5],
            [PgslNumericType.typeName.float32, 6],
            [PgslNumericType.typeName.float16, 7]
        ])]
    ]);

    /**
     * Get a string identification for the type.
     *
     * @param pNumericType - The specific numeric type variant.
     *
     * @returns The type identification.
     */
    public static identifierOf(pNumericType: PgslNumericTypeName): string {
        return pNumericType;
    }

    /**
     * Gets the specific numeric type variant.
     * 
     * @returns The numeric type name.
     */
    public get numericTypeName(): PgslNumericTypeName {
        return this.meta.typeName as PgslNumericTypeName;
    }

    /**
     * Constructor for numeric type.
     * 
     * @param pNumericType - The specific numeric type variant.
     */
    public constructor(pNumericType: PgslNumericTypeName) {
        // Everything a base number is.
        let lTypeKind: BasePgslTypeKind = BasePgslTypeKind.Numeric | BasePgslTypeKind.Plain | BasePgslTypeKind.Scalar;
        lTypeKind |= BasePgslTypeKind.Storable | BasePgslTypeKind.HostShareable | BasePgslTypeKind.Constructible | BasePgslTypeKind.FixedFootprint;

        // A concrete numeric type is any type that is not abstract.
        const lIsConcrete: boolean = pNumericType !== PgslNumericType.typeName.abstractFloat && pNumericType !== PgslNumericType.typeName.abstractInteger;
        lTypeKind |= lIsConcrete ? BasePgslTypeKind.Concrete : BasePgslTypeKind.None;

        // Based on type name, set number type flags.
        lTypeKind |= (() => {
            switch (pNumericType) {
                // Integer types.
                case PgslNumericType.typeName.abstractInteger: return BasePgslTypeKind.Integer | BasePgslTypeKind.Abstract;
                case PgslNumericType.typeName.signedInteger: return BasePgslTypeKind.Integer | BasePgslTypeKind.SignedInteger;
                case PgslNumericType.typeName.unsignedInteger: return BasePgslTypeKind.Integer | BasePgslTypeKind.UnsignedInteger;

                // Float
                case PgslNumericType.typeName.abstractFloat: return BasePgslTypeKind.Float | BasePgslTypeKind.Abstract;
                case PgslNumericType.typeName.float32: return BasePgslTypeKind.Float | BasePgslTypeKind.Float32;
                case PgslNumericType.typeName.float16: return BasePgslTypeKind.Float | BasePgslTypeKind.Float16;
            }
        })();

        // Create and use meta.
        super(lTypeKind, {
            typeName: PgslNumericType.identifierOf(pNumericType)
        });
    }

    /**
     * Compare this numeric type with a target type for equality.
     * Two numeric types are equal if they have the same numeric type variant.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same numeric type.
     */
    public equals(pTarget: BasePgslType): pTarget is this {
        // Must both be the same numeric type.
        if (!this.isSameTypeClass(pTarget)) {
            return false;
        }

        // Must have the same numeric type.
        return this.numericTypeName === pTarget.numericTypeName;
    }

    /**
     * Get this types convertion rank to another type.
     * 
     * @param pTarget - Conversion target type.
     * 
     * @returns the conversation rank from this type to the specified.
     */
    public conversionRankTo(pTarget: BasePgslType): number {
        // Target type must be a numeric type.
        if (!this.isSameTypeClass(pTarget)) {
            return Number.POSITIVE_INFINITY;
        }

        // Same numeric type needs no conversion.
        if (this.numericTypeName === pTarget.numericTypeName) {
            return 0;
        }

        // Any other numeric types must be a registered automatic conversion.
        return PgslNumericType.CONVERSION_RANKS.get(this.numericTypeName)?.get(pTarget.numericTypeName) ?? Number.POSITIVE_INFINITY;
    }
}

/**
 * Type representing all available numeric type names.
 */
export type PgslNumericTypeName = (typeof PgslNumericType.typeName)[keyof typeof PgslNumericType.typeName];