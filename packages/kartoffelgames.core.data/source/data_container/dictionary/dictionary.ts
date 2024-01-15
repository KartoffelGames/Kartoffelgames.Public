﻿import { List } from '../list/list';
import { Exception } from '../../exception/exception';

/**
 * Default dictionary.
 */
export class Dictionary<TKey, TValue> extends Map<TKey, TValue> {
    /**
     * Add value and key to dictionary.
     * @param pKey - Key of item.
     * @param pValue - value of item.
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
     * Get all keys that have the set value.
     * @param pValue - Value.
     */
    public getAllKeysOfValue(pValue: TValue): Array<TKey> {
        // Add entires iterator to list and filter for pValue = Value
        const lKeyValuesWithValue: Array<[TKey, TValue]> = List.newListWith(...this.entries()).filter((pItem: [TKey, TValue]) => {
            return pItem[1] === pValue;
        });

        // Get only keys of key values.
        const lKeysOfKeyValue: Array<TKey> = lKeyValuesWithValue.map<TKey>((pItem: [TKey, TValue]): TKey => {
            return pItem[0];
        });

        return lKeysOfKeyValue;
    }

    /**
     * Get item of dictionary. If key does not exists the default value gets returned.
     * @param pKey - key of item.
     * @param pDefault - Default value if key was not found.
     */
    public getOrDefault(pKey: TKey, pDefault: TValue): TValue {
        const lValue: TValue | undefined = this.get(pKey);
        
        if (typeof lValue !== 'undefined') {
            return lValue;
        } else {
            return pDefault;
        }
    }
}