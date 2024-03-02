/**
 * Static helper type to read data from objects.
 * 
 * @public
 */
export class TypeUtil {
    /**
     * Get name of objects property.
     * @param pName - Property name.
     * 
     * @typeParam T - Object with any string key property. 
     * 
     * @returns the name of property.
     * 
     * @remarks
     * Acts more as a type safe way of accessing property names of a type.
     * 
     * @example Read enum names from custom enum object.
     * ``` Typescript
     * class MyClass {
     *    public myProperty: number = 1;
     * }
     * 
     * const propertyName = TypeUtil.nameOf<MyClass>('myProperty'); // => 'myProperty'
     * ```
     * 
     * @experimental @alpha
     */
    public static nameOf<T>(pName: Extract<keyof T, string>): string {
        return pName;
    }
}