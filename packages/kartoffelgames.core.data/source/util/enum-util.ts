/**
 * Enumaration helper.
 */
export class EnumUtil {
    /**
     * Return all keys of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    public static enumNamesToArray(pEnum: object): Array<string> {
        // Convert enum to key array.
        return Object.keys(pEnum).filter((pKey) => isNaN(Number(pKey)));
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