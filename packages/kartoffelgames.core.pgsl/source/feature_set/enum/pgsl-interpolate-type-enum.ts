// TODO: Move them and make them a real enum.
export class PgslInterpolateTypeEnum {
    /**
     * Enum values.
     */
    public static readonly VALUES = {
        Perspective: 'perspective',
        Linear: 'linear',
        Flat: 'flat'
    } as const;

    private static mValidValues: Set<string> | null = null;

    /**
     * Valid values set.
     */
    private static get validValues(): Set<string> {
        if (!PgslInterpolateTypeEnum.mValidValues) {
            const lSet = new Set<string>();
            for (const lKey in PgslInterpolateTypeEnum.VALUES) {
                lSet.add(PgslInterpolateTypeEnum.VALUES[lKey as keyof typeof PgslInterpolateTypeEnum.VALUES]);
            }
            PgslInterpolateTypeEnum.mValidValues = lSet;
        }

        return PgslInterpolateTypeEnum.mValidValues;
    }

    /**
     * Check if the given value is a valid interpolate type.
     * 
     * @param pValue - Value to check.
     * 
     * @returns True if the value is valid, false otherwise.
     */
    public static containsValue(pValue: string): pValue is PgslInterpolateType {
        return PgslInterpolateTypeEnum.validValues.has(pValue);
    }
}

export type PgslInterpolateType = (typeof PgslInterpolateTypeEnum.VALUES)[keyof typeof PgslInterpolateTypeEnum.VALUES];
