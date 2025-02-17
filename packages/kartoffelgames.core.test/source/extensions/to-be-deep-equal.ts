import { expect } from "@std/expect";

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

        const lDeepEqual = (pRootKey: string, pSource: object, pTarget: object): [boolean, string] => {
            // Must have same length.
            if (Reflect.ownKeys(pSource).length !== Reflect.ownKeys(pTarget).length) {
                return [false, `Not all keys are present in object "${pRootKey}"`];
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
                    // Check for null and object. When both are objects but one of them is null
                    if ((lSourceValue === null || lTargetValue === null) && (lSourceValue !== lTargetValue)) {
                        return [false, `Value does not match for key "${lCurrentKey}". "null" !== "object"`];
                    }

                    // Deep compare.
                    const [lDeepEqualResult, lDeepEqualMessage] = lDeepEqual(lCurrentKey, lSourceValue, lTargetValue);
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

        const [lCheckPassed, lMessage] = lDeepEqual('[OBJECT]', lSourceValue, lTargetValue);

        return { message: () => lMessage, pass: lCheckPassed };
    }
});