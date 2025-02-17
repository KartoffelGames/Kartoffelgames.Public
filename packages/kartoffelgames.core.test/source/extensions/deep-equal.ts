import { expect } from "@std/expect";

// Extend expect with deepEqual.
expect.extend({
    toDeepEqual(pContext, pTargetValue: any) {
        const lSourceValue: any = pContext.value;
        const lTargetValue: any = pTargetValue;

        // Convert values to JSON to compare them.
        const lSourceValueJSON: string = JSON.stringify(lSourceValue);
        const lTargetValueJSON: string = JSON.stringify(lTargetValue);

        const lCheckPassed: boolean = lSourceValueJSON === lTargetValueJSON;

        if (pContext.isNot) {
            // Note: when `context.isNot` is set, the test is considered successful when `lCheckPassed` is false
            return { message: () => `Expected object NOT to deep equal.`, pass: lCheckPassed, };
        }

        return { message: () => `Expected object to deep equal.`, pass: lCheckPassed };
    },
});