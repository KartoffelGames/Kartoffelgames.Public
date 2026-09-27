import { BasePgslType, BasePgslTypeKind, type BasePgslTypeMeta } from './base-pgsl-type.ts';

/**
 * Void type definition.
 * Represents the absence of a value, typically used as function return type.
 */
export class PgslVoidType extends BasePgslType {
    /**
     * Type names for void types.
     * Maps void type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            void: 'void'
        } as const;
    }

    /**
     * Get a string identification for the type.
     * 
     * @returns The type identification.
     */
    public static identifierOf(): string {
        return PgslVoidType.typeName.void;
    }

    /**
     * Constructor for void type.
     */
    public constructor() {
        const lTypeMeta: BasePgslTypeMeta = {
            typeName: PgslVoidType.identifierOf()
        };

        super(BasePgslTypeKind.Void, lTypeMeta);
    }

    /**
     * Get this types convertion rank to another type.
     * A void only converts into another void.
     * 
     * @param pTarget - Conversion target type.
     * 
     * @returns Zero for another void, infinity for anything else.
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
     * @returns True when the target is a void type.
     */
    public override equals(pTarget: BasePgslType): pTarget is this {
        return this.isSameTypeClass(pTarget);
    }
}
