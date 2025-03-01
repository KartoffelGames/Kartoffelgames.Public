import type { Async, Expected } from '@std/expect';
import type { ComponentStructure } from './extensions/to-be-component-structure.ts';

// Extends the `Expected` interface with your new matchers signatures
export interface ExtendedExpected<TIsAsync = false> extends Expected<TIsAsync> {
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

    /**
     * Check component structure.
     * 
     * @param pStructure - Expected structure.
     * @param pUseShadowRoot - Use shadow root or threat it as a closed element.
     */
    toBeComponentStructure: (pStructure: ComponentStructure, pUseShadowRoot: boolean) => unknown;

    // NOTE: You also need to overrides the following typings to allow modifiers to correctly infer typing
    not: TIsAsync extends true ? Async<ExtendedExpected<true>> : ExtendedExpected<false>;
    resolves: Async<ExtendedExpected<true>>;
    rejects: Async<ExtendedExpected<true>>;
}