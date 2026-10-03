export class PgslInterpolateSamplingEnum {    
    /**
     * Enum values.
     */
    public static readonly VALUES = {
        Center: 'center',
        Centroid: 'centroid',
        Sample: 'sample',
        First: 'first',
        Either: 'either'
    } as const;

    private static mValidValues: Set<string> | null = null;

    /**
     * Valid values set.
     */
    private static get validValues(): Set<string> {
        if (!PgslInterpolateSamplingEnum.mValidValues) {
            const lSet = new Set<string>();
            for (const lKey in PgslInterpolateSamplingEnum.VALUES) {
                lSet.add(PgslInterpolateSamplingEnum.VALUES[lKey as keyof typeof PgslInterpolateSamplingEnum.VALUES]);
            }
            PgslInterpolateSamplingEnum.mValidValues = lSet;
        }

        return PgslInterpolateSamplingEnum.mValidValues;
    }

    /**
     * Check if the given value is a valid access mode.
     * 
     * @param pValue - Value to check.
     * 
     * @returns True if the value is valid, false otherwise.
     */
    public static containsValue(pValue: string): pValue is PgslInterpolateSampling {
        return PgslInterpolateSamplingEnum.validValues.has(pValue);
    }
}

export type PgslInterpolateSampling = (typeof PgslInterpolateSamplingEnum.VALUES)[keyof typeof PgslInterpolateSamplingEnum.VALUES];