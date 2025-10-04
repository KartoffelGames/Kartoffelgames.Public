import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";

/**
 * Sampler type definition.
 * Represents a sampler resource used for texture sampling operations.
 */
export class PgslSamplerType extends PgslType {
    /**
     * Type names.
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
     */
    public get comparison(): boolean {
        return this.mComparision;
    }

    /**
     * Constructor.
     * 
     * @param pTrace - The trace context.
     * @param pComparison - The sampler type variant.
     */
    public constructor(pTrace: PgslTrace, pComparison: boolean) {
        super(pTrace);

        // Set data.
        this.mComparision = pComparison;
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both share the same comparison type.
     */
    public override equals(pTarget: PgslType): boolean {
        // Must both be a sampler.
        if (!(pTarget instanceof PgslSamplerType)) {
            return false;
        }

        return this.mComparision === pTarget.mComparision;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // A sampler is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    public override isImplicitCastableInto(_pTarget: PgslType): boolean {
        // A sampler is never explicit nor implicit castable.
        return false;
    }

    /**
     * Collect type properties for sampler type.
     * 
     * @param _pTrace - Trace context.
     * 
     * @returns Type properties for sampler type.
     */
    protected override onTypePropertyCollection(_pTrace: PgslTrace): PgslTypeProperties {
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