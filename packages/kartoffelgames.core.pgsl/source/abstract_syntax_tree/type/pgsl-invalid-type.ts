import { BasePgslType, BasePgslTypeKind, type BasePgslTypeMeta } from './base-pgsl-type.ts';

/**
 * Invalid type definition.
 * Represents an invalid or erroneous type that cannot be used in normal operations.
 * This type is used as a fallback when type resolution fails or encounters errors.
 */
export class PgslInvalidType extends BasePgslType {
    /**
     * Type names for invalid types.
     * Maps invalid type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            invalid: '*Invalid*' // Should never be written.
        } as const;
    }

    /**
     * Constructor for invalid type.
     * 
     * @param pShadowedType - Type that is the actual type of this.
     */
    public constructor(pShadowedType?: BasePgslType) {
        // Create meta.
        const lTypeMeta: BasePgslTypeMeta = {
            typeName: PgslInvalidType.typeName.invalid
        };

        super(BasePgslTypeKind.Invalid, lTypeMeta, pShadowedType);
    }

    /**
     * Get this types convertion rank to another type.
     * An invalid type can never be converted to any type.
     * 
     * @param _pTarget - Conversion target type.
     * 
     * @returns Always infinity.
     */
    public override conversionRankTo(_pTarget: BasePgslType): number {
        return Number.POSITIVE_INFINITY;
    }

    /**
     * Check if this invalid type is equal to the target type.
     * Invalid types are never equal to any type, including other invalid types.
     * 
     * @param _pTarget - Target type to compare against.
     * 
     * @returns false.
     */
    public override equals(_pTarget: BasePgslType): _pTarget is this {
        return false;
    }
}
