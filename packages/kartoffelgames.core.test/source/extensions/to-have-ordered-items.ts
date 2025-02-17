import { expect } from "@std/expect";

// Extend expect with deepEqual.
expect.extend({
    toHaveOrderedItems(pContext, pTargetValue: Array<any>) {
        // Target value is not an array.
        if (!Array.isArray(pContext.value)) {
            // Must fail even when test is negated.
            return { message: () => `Expected value to be an array.`, pass: false !== pContext.isNot };
        }

        // Target value is not an array.
        if (!Array.isArray(pTargetValue)) {
            // Must fail even when test is negated.
            return { message: () => `Expected target value to be an array.`, pass: false !== pContext.isNot };
        }

        const lSourceValue: Array<any> = pContext.value;

        const lNot: string = (pContext.isNot) ? ' NOT' : '';

        // Must have same length.
        if (lSourceValue.length !== pTargetValue.length) {
            return { message: () => `Expected array${lNot} to have the same length.`, pass: false };
        }

        // Compare values.
        for (let lIndex = 0; lIndex < lSourceValue.length; lIndex++) {
            if (lSourceValue[lIndex] !== pTargetValue[lIndex]) {
                return { message: () => `Expected array${lNot} to have the same items.`, pass: false };
            }
        }

        return { message: () => `Expected array${lNot} to have the same items.`, pass: true };
    }
});