import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { PgslType, type PgslTypeProperties } from './pgsl-type.ts';

/**
 * Sampler type definition.
 * Represents a sampler resource used for texture sampling operations.
 */
export class PgslSamplerType extends PgslType {
    /**
     * Type names for sampler types.
     * Maps sampler type names to their string representations.
     */
    public static get typeName() {
        return {
            sampler: 'Sampler',
            samplerComparison: 'SamplerComparison'
        } as const;
    }

    private readonly mComparision: boolean;

    /**
     * If sampler is a comparison sampler.
     * Comparison samplers are used for depth comparison operations.
     * 
     * @returns True if this is a comparison sampler, false otherwise.
     */
    public get comparison(): boolean {
        return this.mComparision;
    }

    /**
     * Constructor for sampler type.
     * 
     * @param pComparison - Whether this is a comparison sampler.
     */
    public constructor(pComparison: boolean) {
        super();

        // Set data.
        this.mComparision = pComparison;
    }

    /**
     * Compare this sampler type with a target type for equality.
     * Two sampler types are equal if they have the same comparison mode.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both samplers have the same comparison mode.
     */
    public override equals(pTarget: PgslType): boolean {
        // Must both be a sampler.
        if (!(pTarget instanceof PgslSamplerType)) {
            return false;
        }

        return this.mComparision === pTarget.mComparision;
    }

    /**
     * Check if this sampler type is explicitly castable into the target type.
     * Sampler types are never castable to other types.
     * 
     * @param _pTarget - Target type to check castability to.
     * 
     * @returns Always false - samplers cannot be cast.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // A sampler is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if this sampler type is implicitly castable into the target type.
     * Sampler types are never castable to other types.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns Always false - samplers cannot be cast.
     */
    public override isImplicitCastableInto(pTarget: PgslType): boolean {
        // A sampler is never explicit nor implicit castable.
        return this.equals(pTarget);
    }

    /**
     * Collect type properties for sampler types.
     * Samplers have fixed footprints and are concrete but not storable or constructible.
     * 
     * @param _pContext - Context (unused for sampler properties).
     * 
     * @returns Type properties for sampler types.
     */
    protected override onProcess(_pContext: AbstractSyntaxTreeContext): PgslTypeProperties {
        return {
            storable: false,
            hostShareable: false,
            constructible: false,
            fixedFootprint: true,
            composite: false,
            indexable: false,
            concrete: true,
            scalar: false,
            plain: false
        };
    }
}