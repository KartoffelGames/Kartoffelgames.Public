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

        // Create meta.
        const lMeta: BasePgslTypeMeta = {
            typeName: pNumericType
        };

        super(lTypeKind, lMeta);
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

        switch (this.mNumericType) {
            // An abstract integer is castable into all numeric types.
            case PgslNumericType.typeName.abstractInteger: {
                return true;
            }

            // An abstract float is only castable into float types.
            case PgslNumericType.typeName.abstractFloat: {
                // List of all float types.
                const lFloatTypes: Array<PgslNumericTypeName> = [
                    PgslNumericType.typeName.abstractFloat,
                    PgslNumericType.typeName.float32,
                    PgslNumericType.typeName.float16
                ];

                // Check if target type is a float type.
                if (lFloatTypes.includes(pTarget.numericTypeName)) {
                    return true;
                }
            }
        }

        // Any other non-abstract numeric type is only castable when they are the same type.
        return this.equals(pTarget);
    }
}

/**
 * Type representing all available numeric type names.
 */
export type PgslNumericTypeName = (typeof PgslNumericType.typeName)[keyof typeof PgslNumericType.typeName];