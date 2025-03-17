import { expect } from '@std/expect';
import { Dictionary } from "@kartoffelgames/core";

export const DeepEqual = (pRootKey: string, pSource: object, pTarget: object, pCheckedObject: Dictionary<object, object>): [boolean, string] => {
    // Whatever. Should work.
    if (pCheckedObject.get(pSource) === pTarget) {
        return [true, 'Objects are equal.'];
    }

    // Add current object to checked list.
    pCheckedObject.set(pSource, pTarget);

    // Must have same length.
    if (Reflect.ownKeys(pSource).length !== Reflect.ownKeys(pTarget).length) {
        // Find missing.
        const lSourceKeys: Set<PropertyKey> = new Set<PropertyKey>(Reflect.ownKeys(pSource));
        const lTargetKeys: Set<PropertyKey> = new Set<PropertyKey>(Reflect.ownKeys(pTarget));

        // Remove same keys from list.
        for (const lKey of lSourceKeys) {
            if (lTargetKeys.has(lKey)) {
                lSourceKeys.delete(lKey);
                lTargetKeys.delete(lKey);
            }
        }

        return [false, `Not all keys are present in object "${pRootKey}". Difference (SOURCE[${[...lSourceKeys].join(', ')}]) => (TARGET[${[...lTargetKeys].join(', ')}])`];
    }

    // Compare values.
    for (const lKey of Reflect.ownKeys(pSource)) {
        const lSourceValue: any = (<any>pSource)[lKey];
        const lTargetValue: any = (<any>pTarget)[lKey];

        const lCurrentKey: string = `${pRootKey}.${lKey.toString()}`;

        // Check for same type.
        if (typeof lSourceValue !== typeof lTargetValue) {
            return [false, `Value type does not match for key "${lCurrentKey}". "${typeof lSourceValue}" !== "${typeof lTargetValue}"`];
        }

        // Deep compare objects.
        if (typeof lSourceValue === 'object' && typeof lTargetValue === 'object') {
            // Both null, both are equal.
            if (lSourceValue === null && lTargetValue === null) {
                continue;
            }

            // Check for null and object. When both are objects but one of them is null
            if ((lSourceValue === null || lTargetValue === null) && (lSourceValue !== lTargetValue)) {
                return [false, `Value does not match for key "${lCurrentKey}". "null" !== "object"`];
            }

            // Deep compare.
            const [lDeepEqualResult, lDeepEqualMessage] = DeepEqual(lCurrentKey, lSourceValue, lTargetValue, pCheckedObject);
            if (!lDeepEqualResult) {
                return [lDeepEqualResult, lDeepEqualMessage];
            }

            continue;
        }

        // Simple compare.
        if (lSourceValue !== lTargetValue) {
            return [false, `Value does not match for key "${lCurrentKey}". "${lSourceValue}" !== "${lTargetValue}"`];
        }
    }

    return [true, 'Objects are equal.'];
};

// Extend expect with deepEqual.
expect.extend({
    toBeDeepEqual(pContext, pTargetValue: object) {
        // Target value is not an array.
        if (typeof pContext.value !== 'object' || pContext.value === null) {
            // Must fail even when test is negated.
            return { message: () => `Expected value to be an object.`, pass: false !== pContext.isNot };
        }

        // Target value is not an array.
        if (typeof pTargetValue !== 'object' || pTargetValue === null) {
            // Must fail even when test is negated.
            return { message: () => `Expected target value to be an object.`, pass: false !== pContext.isNot };
        }

        const lSourceValue: object = pContext.value;
        const lTargetValue: object = pTargetValue;

        const [lCheckPassed, lMessage] = DeepEqual('[OBJECT]', lSourceValue, lTargetValue,  new Dictionary<object, object>);

        return { message: () => lMessage, pass: lCheckPassed };
    }
});