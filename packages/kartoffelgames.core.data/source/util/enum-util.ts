/**
 * Enumaration helper.
 */
export class EnumUtil {
    /**
     * Return enum of enum value.
     * @param pEnum - typeof Enum object.
     * @param pValue - Value of enum.
     */
    public static enumKeyByValue<T>(pEnum: object, pValue: any): T | undefined {
        // Thats it... :)
        if (EnumUtil.enumValueExists<T>(pEnum, pValue)) {
            return pValue;
        } else {
            return undefined;
        }
    }

    /**
     * Return all keys of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    public static enumNamesToArray(pEnum: object): Array<string> {
        // Convert enum to key array.
        return Object.keys(pEnum).filter((pKey) => isNaN(Number(pKey)));
    }

    /**
     * Check if value exists in enum object.
     * @param pEnum - typeof Enum object.
     * @param pValue - Value of enum.
     */
    public static enumValueExists<T>(pEnum: object, pValue: any): pValue is T {
        return EnumUtil.enumValuesToArray(pEnum).includes(pValue);
    }

    /**
     * Return all values of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    public static enumValuesToArray<T>(pEnum: object): Array<T> {
        const lEnumValues: Array<T> = new Array<T>();

        // Convert enum to vaue array by iterating over all keys.
        for (const lKey of EnumUtil.enumNamesToArray(pEnum)) {
            lEnumValues.push((<{ [key: string]: T; }>pEnum)[lKey]);
        }

        return lEnumValues;
    }
}