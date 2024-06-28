/**
 * Static helper type to read data from enum objects.
 * 
 * @public
 */
export class EnumUtil {
    /**
     * Infers value into enum type.
     * When the values can not be infered into the specified enum, undefined is returned.
     * 
     * @param pEnum - typeof Enum object.
     * @param pValue - Value of enum.
     * 
     * @typeParam T - Enum type the value should be infered into.
     * 
     * @returns Infered `pValue` parameter or undefined when the value does not exists as the enums value.
     * 
     * @example Try to cast two possible enum values.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     * 
     * const existingValue = EnumUtil.cast<MyEnum>(MyEnum, 1); // => MyEnum.Entry1
     * const noneExistingValue = EnumUtil.cast<MyEnum>(MyEnum, 5); // => undefined
     * ```
     */
    public static cast<TEnum>(pEnum: object, pValue: any): TEnum | undefined {
        // Thats it... :)
        if (EnumUtil.exists<TEnum>(pEnum, pValue)) {
            return pValue;
        } else {
            return undefined;
        }
    }

    /**
     * Check value existence on a enum object.
     * Infers `pValue` parameter as enum type.
     * @param pEnum - typeof Enum object.
     * @param pValue - Value of enum.
     * 
     * @typeParam T - Enum type the value should be infered into.
     * 
     * @returns True when the value can be casted into enum.
     * 
     * @example Check existence of one two possible enum values.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     * 
     * const existingValue = EnumUtil.exists(MyEnum, 1); // => True
     * const noneExistingValue = EnumUtil.exists(MyEnum, 5); // => False
     * ```
     */
    public static exists<TEnum>(pEnum: object, pValue: any): pValue is TEnum {
        return EnumUtil.valuesOf<TEnum>(pEnum as TEnum).includes(pValue);
    }

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
     * const enumNames = EnumUtil.namesOf(MyEnum); // => ['Entry1', 'Entry2']
     * ```
     */
    public static namesOf<TEnum>(pEnum: TEnum): Array<EnumKey<TEnum>> {
        // Convert enum to key array.
        return Object.keys(pEnum as object).filter((pKey) => isNaN(Number(pKey))) as Array<EnumKey<TEnum>>;
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
     * @example Read enum values from custom enum object.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     * 
     * const enumValues = EnumUtil.valuesOf(MyEnum); // => [1, 2]
     * ```
     */
    public static valuesOf<TEnum>(pEnum: TEnum): Array<EnumValue<TEnum>> {
        const lEnumValues: Array<EnumValue<TEnum>> = new Array<EnumValue<TEnum>>();

        // Convert enum to vaue array by iterating over all keys.
        for (const lKey of EnumUtil.namesOf(pEnum)) {
            lEnumValues.push(pEnum[lKey] as EnumValue<TEnum>);
        }

        return lEnumValues;
    }
}

type EnumKey<TEnum> = keyof TEnum
type EnumValue<TEnum> = TEnum[EnumKey<TEnum>]
