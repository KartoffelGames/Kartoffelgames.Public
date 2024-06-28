/**
 * ICloneable interface. Specifies clone methods.
 * 
 * @typeParam T - Type of cloned object.
 * 
 * @public
 */
export interface ICloneable<T> {
    /**
     * Shallow copy properties or items of the object.
     */
    clone(): T;
}