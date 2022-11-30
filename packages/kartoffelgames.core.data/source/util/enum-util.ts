/**
 * Enumaration helper.
 */
export class EnumUtil {
    /**
     * Return all values of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    public static enumNamesToArray(pEnum: object): Array<string> {
        // Convert enum to array.
        return Object.keys(pEnum);
    }

    /**
     * Return all values of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    public static enumValuesToArray<T>(pEnum: object): Array<T> {
        // Convert enum to array.
        return Object.values(pEnum);
    }
}