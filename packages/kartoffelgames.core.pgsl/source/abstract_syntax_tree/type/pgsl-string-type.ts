import { BasePgslType, BasePgslTypeKind, type BasePgslTypeMeta } from './base-pgsl-type.ts';

/**
 * String type definition.
 * Represents a string value used for text data.
 */
export class PgslStringType extends BasePgslType {
    /**
     * Type names for string types.
     * Maps string type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            string: 'string'
        } as const;
    }

    /**
     * Constructor for string type.
     * 
     * @param pShadowedType - Type that is the actual type of this.
     */
    public constructor(pShadowedType?: BasePgslType) {
        // Create meta.
        const lTypeMeta: BasePgslTypeMeta = {
            typeName: PgslStringType.typeName.string
        };

        super(BasePgslTypeKind.String | BasePgslTypeKind.Concrete, lTypeMeta, pShadowedType);
    }

    /**
     * Get this types convertion rank to another type.
     * A string only converts into another string.
     * 
     * @param pTarget - Conversion target type.
     * 
     * @returns Zero for another string, infinity for anything else.
     */
    public override conversionRankTo(pTarget: BasePgslType): number {
        if(this.equals(pTarget)){
            return 0;
        }

        return  Number.POSITIVE_INFINITY;
    }

    /**
     * Check if type is equal to target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns True when the target is a string type.
     */
    public override equals(pTarget: BasePgslType): pTarget is this {
        return this.isSameTypeClass(pTarget);
    }
}
