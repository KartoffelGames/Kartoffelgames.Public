import { type Async, type Expected, expect } from "@std/expect";

// Extends the `Expected` interface with your new matchers signatures
export interface ExtendedExpected<IsAsync = false> extends Expected<IsAsync> {
    /**
     * Check object or array to be deep equal.
     * Member orderings are considered.
     * 
     * @param pTarget - Target values. 
     */
    toBeDeepEqual: (pTarget: object) => unknown;

    /**
     * Check array to have same items in the same order.
     * 
     * @param pTarget - Target values. 
     */
    toHaveOrderedItems: (pTarget: Array<any>) => unknown;

    // NOTE: You also need to overrides the following typings to allow modifiers to correctly infer typing
    not: IsAsync extends true ? Async<ExtendedExpected<true>> : ExtendedExpected<false>;
    resolves: Async<ExtendedExpected<true>>;
    rejects: Async<ExtendedExpected<true>>;
}