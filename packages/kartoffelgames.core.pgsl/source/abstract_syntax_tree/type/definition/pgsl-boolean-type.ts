import { BasePgslType, BasePgslTypeKind } from './base-pgsl-type.ts';

/**
 * Boolean type definition.
 * Represents a boolean value that can be either true or false.
 */
export class PgslBooleanType extends BasePgslType {
    /**
     * Type names for boolean types.
     * Maps boolean type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            boolean: 'bool'
        } as const;
    }

    /**
     * Get a string identification for the type.
     * 
     * @returns The type identification.
     */
    public static identifierOf(): string {
        return PgslBooleanType.typeName.boolean;
    }

    /**
     * Constructor for boolean type.
     */
    public constructor() {
        // Anything a boolean is.
        const lTypeKind: BasePgslTypeKind =
            BasePgslTypeKind.Boolean | BasePgslTypeKind.Scalar | BasePgslTypeKind.Plain |
            BasePgslTypeKind.Concrete | BasePgslTypeKind.FixedFootprint | BasePgslTypeKind.Constructible |
            BasePgslTypeKind.Storable;

        // Create and use meta.
        super(lTypeKind, {
            typeName: PgslBooleanType.identifierOf()
        });
    }

    /**
     * Get this types convertion rank to another type.
     * A boolean only converts into another boolean.
     * 
     * @param pTarget - Conversion target type.
     * 
     * @returns Zero for another boolean, infinity for anything else.
     */
    public override conversionRankTo(pTarget: BasePgslType): number {
        if (this.equals(pTarget)) {
            return 0;
        }

        return Number.POSITIVE_INFINITY;
    }

    /**
     * Check if type is equal to target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns True when the target is a boolean type.
     */
    public override equals(pTarget: BasePgslType): pTarget is this {
        return this.isSameTypeClass(pTarget);
    }
}
