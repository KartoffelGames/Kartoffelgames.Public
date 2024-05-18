import { Dictionary } from '@kartoffelgames/core.data';

/**
 * Handler for comparing different values.
 */
export class CompareHandler<TValue> {
    private readonly mCompareMemory: Dictionary<object, true>;
    private readonly mMaxDepth: number;

    /**
     * Constructor.
     * Create Compare that deep compares values up to specified depth.
     * 
     * @param pValue - Current value.
     * @param pMaxComparisonDepth - [Default: 4]. Maximal depth for object and array comparison. 
     */
    public constructor(pMaxComparisonDepth: number = 4) {
        this.mCompareMemory = new Dictionary<object, true>();
        this.mMaxDepth = pMaxComparisonDepth;
    }

    /**
     * Compare value with internal value.
     * 
     * @param pTarget - New value.
     */
    public compare(pTarget: TValue, pSource: TValue): boolean {
        // Compare value.
        const lCompareResult: boolean = this.compareValue(pTarget, pSource, 0);

        // Clear compare memory.
        this.mCompareMemory.clear();

        return lCompareResult;
    }

    /**
     * Compare two arrays and their keys.
     * 
     * @param pNewValue - New value.
     * @param pLastValue - Old saved value.
     * @param pCurrentDepth - Current depth of comparison.
     * @returns if arrays are same.
     */
    private compareArray(pNewValue: Array<any>, pLastValue: Array<any>, pCurrentDepth: number): boolean {
        // Check same item count.
        if (pNewValue.length !== pLastValue.length) {
            return false;
        }

        // Do not compare nested parent values again.
        // Fails for a fraction of cases.
        if (this.mCompareMemory.has(pNewValue)) {
            return true;
        } else {
            this.mCompareMemory.set(pNewValue, true);
        }

        // Compare each key.
        for (let lIndex: number = 0; lIndex < pNewValue.length; lIndex++) {
            if (!this.compareValue(pNewValue[lIndex], pLastValue[lIndex], pCurrentDepth + 1)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Compare two objects and their keys.
     * 
     * @param pNewValue - New value.
     * @param pLastValue - Old saved value.
     * @param pCurrentDepth - Current depth of comparison.
     * @returns if object are same.
     */
    private compareObject(pNewValue: object, pLastValue: object, pCurrentDepth: number): boolean {
        // Check same property count.
        if (Object.keys(pNewValue).length !== Object.keys(pLastValue).length) {
            return false;
        }

        // Ignore HTMLElements.
        if (pNewValue instanceof Node || pLastValue instanceof Node) {
            return pNewValue === pLastValue;
        }

        // Do not compare nested parent values again.
        // Fails for a fraction of cases.
        if (this.mCompareMemory.has(pNewValue)) {
            return true;
        } else {
            this.mCompareMemory.set(pNewValue, true);
        }

        // Compare each key.
        for (const lKey in pNewValue) {
            const lNewValue: any = Reflect.get(pNewValue, lKey);
            const lLastValue: any = Reflect.get(pLastValue, lKey);
            if (!this.compareValue(lNewValue, lLastValue, pCurrentDepth + 1)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Compare two values and return if they are the same.
     * 
     * @param lOriginalNewValue - New value.
     * @param lOriginalCurrentValue - Old saved value.
     * @param pCurrentDepth - Current depth of comparison.
     * @returns if object are same.
     */
    private compareValue(pNewValue: any, pLastValue: any, pCurrentDepth: number): boolean {
        // Check type.
        if (typeof pNewValue !== typeof pLastValue || pNewValue === null && pLastValue !== null || pNewValue !== null && pLastValue === null) {
            return false;
        }

        // Check if both are simple or object values.
        if (typeof pNewValue === 'object' && pNewValue !== null) {
            if (Array.isArray(pNewValue)) {
                // Check if both are arrays.
                if (!Array.isArray(pLastValue)) {
                    return false;
                }

                // Only proceed if max depth not reached.
                if (pCurrentDepth < this.mMaxDepth) {
                    return this.compareArray(pNewValue, pLastValue, pCurrentDepth);
                } else {
                    return true;
                }
            } else { // Is object
                // Check if both are not arrays..
                if (Array.isArray(pLastValue)) {
                    return false;
                }

                // Only proceed if max depth not reached.
                if (pCurrentDepth < this.mMaxDepth) {
                    return this.compareObject(pNewValue, pLastValue, pCurrentDepth);
                } else {
                    return true;
                }
            }
        } else if (typeof pNewValue === 'function') {
            return pNewValue === pLastValue;
        } else {
            // Check simple value. Number, String, Function, Boolean, Undefined.
            return pNewValue === pLastValue;
        }
    }
}