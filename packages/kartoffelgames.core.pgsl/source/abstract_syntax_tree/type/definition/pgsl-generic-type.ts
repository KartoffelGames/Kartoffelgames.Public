import { BasePgslType, BasePgslTypeKind } from './base-pgsl-type.ts';

/**
 * Generic type definition for a single generic type with optional restrictions.
 */
export class PgslGenericType extends BasePgslType {
    /**
     * Type names for generic types.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            generic: 'Generic'
        } as const;
    }

    /**
     * Get a string identification for the type.
     * The identification is not unique between generics of the same name, so generic types must never be cached.
     *
     * @param pGenericName - Name of the generic.
     *
     * @returns The type identification.
     */
    public static identifierOf(pGenericName: string): string {
        return PgslGenericType.typeName.generic + '[' + pGenericName + ']';
    }

    private readonly mGenericName: string;

    /**
     * Generic name.
     */
    public get name(): string {
        return this.mGenericName;
    }

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
     * @param pGenericName - Name of the generic.
     * @param pRestrictions - Generic type restrictions.
     */
    public constructor(pGenericName: string, pRestrictions: Array<BasePgslType>) {
        // Combining all type kinds by ANDing them.
        const lTypeKind: BasePgslTypeKind = (() => {
            // If its a wildcard restriction it naturally doesnt fit any real type unless it get gated somewhere.
            if (pRestrictions.length === 0) {
                return BasePgslTypeKind.None;
            }

            return pRestrictions.reduce<BasePgslTypeKind>((pCurrent: BasePgslTypeKind, pNext: BasePgslType) => {
                return pCurrent & pNext.kind;
            }, ~0);
        })();

        // Create and use meta.
        super(lTypeKind, {
            typeName: PgslGenericType.identifierOf(pGenericName),
            generics: pRestrictions
        });

        this.mGenericName = pGenericName;
    }

    /**
     * Wether a type is assignable to this type.
     * 
     * @param pType - Source type.
     * 
     * @returns true when this type can be assinged 
     */
    public override accepts(pType: BasePgslType): boolean {
        // Fast check reference. A type allways accepts itself.
        if (pType === this) {
            return true;
        }

        // Without a restriction, all generics are wildcards.
        if(this.restrictions.length === 0){
            return true;
        }

        // Check if any restriction can assign the target type.
        for (const lRestriction of this.restrictions) {
            if (pType.conversionRankTo(lRestriction) < Number.POSITIVE_INFINITY) {
                return true;
            }
        }

        return false;
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
        // If it has no restriction, it cant be converted into nothing because its type cant be narrowed.
        if (this.restrictions.length === 0) {
            return Number.POSITIVE_INFINITY;
        }

        // Find the worst conversion rank of all restrictions.
        let lConversionRank: number = 0;
        for (const lRestriction of this.restrictions) {
            // Get conversion rank between type restriction and use it if its the worst found yet.
            const lRestrictionsConversionRank: number = lRestriction.conversionRankTo(pTarget);
            if (lRestrictionsConversionRank > lConversionRank) {
                lConversionRank = lRestrictionsConversionRank;
            }

            // Shortcut on worst possible found conversion rank, so no other restriction needs to be checked.
            if (lConversionRank === Number.POSITIVE_INFINITY) {
                return lConversionRank;
            }
        }

        return lConversionRank;
    }

}