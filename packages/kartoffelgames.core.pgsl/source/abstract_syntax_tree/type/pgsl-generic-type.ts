import { BasePgslType, BasePgslTypeKind, BasePgslTypeMeta } from "./base-pgsl-type.ts";

export class PgslGenericType extends BasePgslType {
    /**
     * Generic type restrictions that can be empty.
     */
    public get restrictions(): ReadonlyArray<BasePgslType> {
        // Generics are allways set. Even when empty.
        return this.meta.generics!;
    }

    /**
     * Construct a generic type.
     * 
     * @param pRestrictions - Generic type restrictions.
     */
    public constructor(pRestrictions: Array<BasePgslType>) {
        // Combining all type kinds by ANDing them.
        const lTypeKind: BasePgslTypeKind = (() => {
            // If its a wildcard restriction it naturally doesnt fit any real type unless it get gated somewhere.
            if(pRestrictions.length === 0) {
                return BasePgslTypeKind.None;
            }

            return pRestrictions.reduce<BasePgslTypeKind>((pCurrent: BasePgslTypeKind, pNext: BasePgslType) => {
                return pCurrent & pNext.kind;
            }, ~0);
        })();

        // Create meta.
        const lTypeMeta: BasePgslTypeMeta = {
            typeName: 'Generic',
            generics: pRestrictions
        };

        super(lTypeKind, lTypeMeta);
    }

    /**
     * Checks if this type is equal to the target type.
     * 
     * @param pTarget - The target type to compare against.
     * 
     * @returns True when both types describe the same type, false otherwise.
     */
    public override equals(pTarget: BasePgslType): pTarget is this {
        // A generic is only fully equal if its the same cached reference. Otherwise its just a passthrough to another (different) generic.
        return pTarget === this;
    }

    /**
     * Get this types convertion rank to another type.
     * 
     * @param pTarget - Conversion target type.
     * 
     * @returns the conversation rank from this type to the specified.
     */
    public override conversionRankTo(pTarget: BasePgslType): number {
        let lConversionRank: number = Number.POSITIVE_INFINITY;
        for (const lRestriction of this.restrictions) {
            // Get conversion rank between type restriction and use it if its the best found yet.
            const lRestrictionsConversionRank: number = lRestriction.conversionRankTo(pTarget);
            if (lRestrictionsConversionRank < lConversionRank) {
                lConversionRank = lRestrictionsConversionRank;
            }
        }

        return lConversionRank;
    }

}