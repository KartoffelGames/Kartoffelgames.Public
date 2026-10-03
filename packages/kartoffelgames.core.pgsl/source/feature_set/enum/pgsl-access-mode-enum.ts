export class PgslAccessModeEnum {    
    /**
     * Enum values.
     */
    public static readonly VALUES = {
        Read: 'read',
        Write: 'write',
        ReadWrite: 'read_write'
    } as const;

    private static mValidValues: Set<string> | null = null;

    /**
     * Valid values set.
     */
    private static get validValues(): Set<string> {
        if (!PgslAccessModeEnum.mValidValues) {
            const lSet = new Set<string>();
            for (const lKey in PgslAccessModeEnum.VALUES) {
                lSet.add(PgslAccessModeEnum.VALUES[lKey as keyof typeof PgslAccessModeEnum.VALUES]);
            }
            PgslAccessModeEnum.mValidValues = lSet;
        }

        return PgslAccessModeEnum.mValidValues;
    }

    /**
     * Check if the given value is a valid access mode.
     * 
     * @param pValue - Value to check.
     * 
     * @returns True if the value is valid, false otherwise.
     */
    public static containsValue(pValue: string): pValue is PgslAccessMode {
        return PgslAccessModeEnum.validValues.has(pValue);
    }
}

export type PgslAccessMode = (typeof PgslAccessModeEnum.VALUES)[keyof typeof PgslAccessModeEnum.VALUES];