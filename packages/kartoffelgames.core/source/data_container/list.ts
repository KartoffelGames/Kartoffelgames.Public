import type { ICloneable } from '../interface/i-cloneable.ts';

/**
 * Wrapper for {@link Array}.
 * 
 * @typeParam T - Type of items of list. 
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array}
 * 
 * @public
 */
export class List<T> extends Array<T> implements ICloneable<List<T>> {
    /**
     * Create list and add items.
     * Prevents spread operator with number arrays to initialize array with length instead of item.
     * 
     * @param pItemList - Items.
     * 
     * @example Create new list with `newListWith` and failing creation with the native `Array` constructor.
     * ```TypeScript
     * const newList = List.newListWith<number>(...[3]); // => [3] 
     * const newListWrong = new List<number>(...[3]);    // => [undefined, undefined, undefined] 
     * ```
     */
    public static newListWith<T>(...pItemList: Array<T>): List<T> {
        const lNewList: List<T> = new List<T>();
        lNewList.push(...pItemList);

        return lNewList;
    }

    /**
     * Remove every item.
     * 
     * @example Clear a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 2, 3);
     * list.clear(); 
     * 
     * console.log(list.length); // => 0
     * ```
     */
    public clear(): void {
        this.splice(0, this.length);
    }

    /**
     * Create new list and add same items.
     * @see {@link ICloneable.clone}
     * 
     * @returns cloned list with shallow copied item refernces.
     * 
     * @example Clone and compare list and list items.
     * ```TypeScript
     * const list = List.newListWith<object>(new Object());
     * 
     * const clone = list.clone();
     * 
     * const areSame = list === clone; // => False
     * const itemSame = list[0] === list[0]; // => True
     * ```
     */
    public clone(): List<T> {
        return List.newListWith(...this);
    }

    /**
     * Copy distinct values into new list.
     * 
     * @returns new list instance with only distinct values.
     * 
     * @example Create a new list with duplicates and create a new distinct list out of it.
     * ```TypeScript
     * const listWithDuplicates = List.newListWith<number>(1, 1, 2, 3, 3);
     * const distinctList = listWithDuplicates.distinct(); // => [1, 2, 3]
     * ```
     */
    public distinct(): List<T> {
        return List.newListWith(...new Set(this));
    }

    /**
     * Compares this array with the specified one.
     * Compares length and every item by reference and order.
     * Does only shallow compare item references.
     * 
     * @param pArray - Array to compare.
     * 
     * @returns true for equality.
     * 
     * @example Compare two arrays with a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 3, 2);
     * 
     * const isEqual = list.equals([1, 3, 2]) // => True
     * const isUnequal = list.equals([1, 2, 3]) // => False
     * ```
     */
    public equals(pArray: Array<unknown>): boolean {
        // Check if array are same, dont null and have same length.
        if (this === pArray) {
            return true;
        } else if (!pArray || this.length !== pArray.length) {
            return false;
        }

        // Check each item.
        for (let lIndex = 0; lIndex < this.length; ++lIndex) {
            if (this[lIndex] !== pArray[lIndex]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Removes the first appearence of a value.
     * 
     * @param pValue - Target value to remove.
     * 
     * @returns removed element. When no element was removed, undefined is returned instead.
     * 
     * @example Remove a existing and a none existing item of a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 3, 2);
     * 
     * const removedElement = list.remove(1); // => 1
     * const noneExistingElement = list.remove(4); // => undefined
     * ```
     */
    public remove(pValue: T): T | undefined {
        const lFoundIndex: number = this.indexOf(pValue);

        // Only remove if found.
        if (lFoundIndex !== -1) {
            return this.splice(lFoundIndex, 1)[0];
        }

        return undefined;
    }

    /**
     * Replace first appearence of value.
     * 
     * @param pOldValue - Target value to replace.
     * @param pNewValue - Replacement value.
     * 
     * @returns replaced element. When no element was replaced, undefined is returned instead.
     * 
     * @example Replace a existing and a none existing item of a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 5, 3);
     * 
     * const removedElement = list.replace(5, 2); // => 5
     * const noneExistingElement = list.replace(4, 3); // => undefined
     * 
     * console.log(list); // => [1, 2, 3]
     * ```
     */
    public replace(pOldValue: T, pNewValue: T): T | undefined {
        const lFoundIndex: number = this.indexOf(pOldValue);

        // Only replace if found.
        if (lFoundIndex !== -1) {
            // Save old value and replace it with new value.
            const lOldValue: T = this[lFoundIndex];
            this[lFoundIndex] = pNewValue;

            return lOldValue;
        }

        return undefined;
    }

    /**
     * Returns a string representation of this list.
     * @override base objects {@link Array.toString}
     * 
     * @returns string representation for this list.
     * 
     * @example Output a string representation of a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 2, 3);
     * console.log(list.toString()); // => [1, 2, 3]
     * ```
     */
    public override toString(): string {
        return `[${super.join(', ')}]`;
    }
}