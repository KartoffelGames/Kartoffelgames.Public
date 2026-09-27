import { BasePgslType, BasePgslTypeKind, type BasePgslTypeMeta } from './base-pgsl-type.ts';

/**
 * Sampler type definition.
 * Represents a sampler resource used for texture sampling operations.
 */
export class PgslSamplerType extends BasePgslType {
    /**
     * Type names for sampler types.
     * Maps sampler type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            sampler: 'Sampler',
            samplerComparison: 'SamplerComparison'
        } as const;
    }

    /**
     * Get a string identification for the type.
     * 
     * @param pComparison - Whether this is a comparison sampler.
     * 
     * @returns The type identification.
     */
    public static identifierOf(pComparison: boolean): string {
        return pComparison ? PgslSamplerType.typeName.samplerComparison : PgslSamplerType.typeName.sampler;
    }

    private readonly mComparison: boolean;

    /**
     * If sampler is a comparison sampler.
     * Comparison samplers are used for depth comparison operations.
     * 
     * @returns True if this is a comparison sampler, false otherwise.
     */
    public get comparison(): boolean {
        return this.mComparison;
    }

    /**
     * Constructor for sampler type.
     * 
     * @param pComparison - Whether this is a comparison sampler.
     */
    public constructor(pComparison: boolean) {
        // Anything a sampler is.
        const lTypeKind: BasePgslTypeKind = BasePgslTypeKind.Sampler | BasePgslTypeKind.Concrete | BasePgslTypeKind.Storable;

        // Create meta, use the right type name.
        const lTypeMeta: BasePgslTypeMeta = {
            typeName: PgslSamplerType.identifierOf(pComparison)
        };

        super(lTypeKind, lTypeMeta);

        this.mComparison = pComparison;
    }

    /**
     * Get this types convertion rank to another type.
     * A sampler only converts into the same sampler variant.
     * 
     * @param pTarget - Conversion target type.
     * 
     * @returns Zero for the same sampler variant, infinity for anything else.
     */
    public override conversionRankTo(pTarget: BasePgslType): number {
        if (this.equals(pTarget)) {
            return 0;
        }

        return Number.POSITIVE_INFINITY;
    }

    /**
     * Compare this sampler type with a target type for equality.
     * Two sampler types are equal if they have the same comparison mode.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both samplers have the same comparison mode.
     */
    public override equals(pTarget: BasePgslType): pTarget is this {
        // Must both be a sampler.
        if (!this.isSameTypeClass(pTarget)) {
            return false;
        }

        return this.mComparison === pTarget.comparison;
    }
}

/**
 * Type representing all available sampler type names.
 */
export type PgslSamplerTypeName = (typeof PgslSamplerType.typeName)[keyof typeof PgslSamplerType.typeName];
