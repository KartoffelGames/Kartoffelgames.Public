import { List } from './list';
import { Exception } from '../exception/exception';
import { ICloneable } from '../interface/i-cloneable';

/**
 * Wrapper for {@link Map}.
 * Extended by {@link Dictionary.add}, {@link Dictionary.getAllKeysOfValue}, {@link Dictionary.getOrDefault} and {@link Dictionary.map}.
 * 
 * @typeParam TKey - Type of objects defined for keys. 
 * @typeParam TValue - Type of objects defined for values. 
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map}
 * 
 * @public
 */
export class Dictionary<TKey, TValue> extends Map<TKey, TValue> implements ICloneable<Dictionary<TKey, TValue>>{
    /**
     * Add value and key to dictionary. 
     * Throws {@link Exception}  for any added dublicate key. 
     * 
     * @param pKey - Key of item.
     * @param pValue - value of item.
     * 
     * @throws
     * On any dublicate key set,
     * 
     * @example Adding a new and existing key.
     * ```TypeScript
     * const dictionary = new Dictionary<string, number>();
     * dictionary.add('a', 4); // => OK
     * dictionary.add('a', 4); // => Fail: Dublicate key.
     * ```
     */
    public add(pKey: TKey, pValue: TValue): void {
        // Add value and key to containers.
        if (!this.has(pKey)) {
            this.set(pKey, pValue);
        } else {
            throw new Exception("Can't add dublicate key to dictionary.", this);
        }
    }

    /**
     * Create new dicionary and add same keys and values.
     * @see {@link ICloneable.clone}
     * 
     * @returns cloned dictionary with shallow copied key and value refernces.
     * 
     * @example Clone and compare dictionary and dictionary items.
     * ```TypeScript
     * const dictionary = new Dictionary<string, object>();
     * dictionary.set('a', new Object());
     * 
     * const clone = dictionary.clone();
     * 
     * const areSame = dictionary === clone; // => False
     * const itemSame = dictionary.get('a') === clone.get('a'); // => True
     * ```
     */
    public clone(): Dictionary<TKey, TValue> {
        return new Dictionary<TKey, TValue>(this);
    }

    /**
     * Get all keys that have the set value.
     * 
     * @param pValue - Value.
     * 
     * @returns all keys that hold the specified value.
     * 
     * @example Get keys of a value.
     * ```TypeScript
     * const dictionary = new Dictionary<string, number>();
     * dictionary.set('a', 1);
     * dictionary.set('b', 2);
     * dictionary.set('c', 1);
     * 
     * const keys = dictionary.getAllKeysOfValue(1); // => ['a', 'c']
     * ```
     */
    public getAllKeysOfValue(pValue: TValue): Array<TKey> {
        // Add entries iterator to list and filter for pValue = Value
        const lKeyValuesWithValue: Array<[TKey, TValue]> = [...this.entries()].filter((pItem: [TKey, TValue]) => {
            return pItem[1] === pValue;
        });

        // Get only keys of key values.
        const lKeysOfKeyValue: Array<TKey> = lKeyValuesWithValue.map<TKey>((pItem: [TKey, TValue]): TKey => {
            return pItem[0];
        });

        return lKeysOfKeyValue;
    }

    /**
     * Get item. If the key does not exists the default value gets returned.
     * @param pKey - Key of item.
     * @param pDefault - Default value if key was not found.
     * 
     * @returns value of the key. If the key does not exists the default value gets returned.
     * 
     * @example Get value or default from a existing and none existing key. 
     * ```TypeScript
     * const dictionary = new Dictionary<string, number>();
     * dictionary.set('a', 1);
     * 
     * const keyA = dictionary.getOrDefault('a', 22); // => 1
     * const keyZ = dictionary.getOrDefault('z', 22); // => 22
     * ```
     */
    public getOrDefault(pKey: TKey, pDefault: TValue): TValue {
        const lValue: TValue | undefined = this.get(pKey);
        if (typeof lValue !== 'undefined') {
            return lValue;
        }

        return pDefault;
    }

    /**
     * Maps information into new list.
     * @param pFunction - Mapping funktion.
     * 
     * @typeParam T - Result type of mapping resolver function.
     * 
     * @returns mapped data for each item.
     * 
     * @example Remap all dictionary values by adding a number to all values. 
     * ```TypeScript
     * const dictionary = new Dictionary<string, number>();
     * dictionary.set('a', 1);
     * dictionary.set('b', 2);
     * 
     * const list = dictionary.map((key, value) => value + 1); //  => [2, 3]
     * ```
     */
    public map<T>(pFunction: (pKey: TKey, pValue: TValue) => T): Array<T> {
        const lResultList: List<T> = new List<T>();

        for (const lKeyValuePair of this) {
            // Execute callback and add result to list.
            const lMappingResult: T = pFunction(lKeyValuePair[0], lKeyValuePair[1]);
            lResultList.push(lMappingResult);
        }

        return lResultList;
    }
}