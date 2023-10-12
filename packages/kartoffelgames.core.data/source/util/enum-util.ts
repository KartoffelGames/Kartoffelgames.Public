/**
 * Static helper type to read data from enum objects.
 * 
 * @public
 */
export class EnumUtil {
    /**
     * Return all keys of an enum as array.
     * 
     * @param pEnum - typeof Enum object.
     * 
     * @returns All enum key as array in defined order.
     * 
     * @remarks
     * Does only work for number enums and should fail for mixed or string enums.
     * 
     * @example Read enum names from custom enum object.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     * 
     * const enumNames = EnumUtil.enumNamesToArray(MyEnum); // => ['Entry1', 'Entry2']
     * ```
     * 
     * @experimental @alpha
     */
    public static namesOf(pEnum: object): Array<string> {
        // Convert enum to key array.
        return Object.keys(pEnum).filter((pKey) => isNaN(Number(pKey)));
    }

    /**
     * Return all values of an enum as array.
     * 
     * @param pEnum - typeof Enum object.
     * 
     * @typeParam T - Enum value type.
     * 
     * @returns All enum values as array in defined order.
     * 
     * @remarks
     * Does only work for number enums and should fail for mixed or string enums.
     * 
     * @example Read enum names from custom enum object.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     * 
     * const enumValues = EnumUtil.enumValuesToArray(MyEnum); // => [1, 2]
     * ```
     * 
     * @experimental @alpha
     */
    public static valuesOf<T>(pEnum: object): Array<T> {
        const lEnumValues: Array<T> = new Array<T>();

        // Convert enum to vaue array by iterating over all keys.
        for (const lKey of EnumUtil.namesOf(pEnum)) {
            lEnumValues.push((<{ [key: string]: T; }>pEnum)[lKey]);
        }

        return lEnumValues;
    }
}