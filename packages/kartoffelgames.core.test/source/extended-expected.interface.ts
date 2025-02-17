import { type Async, type Expected, expect } from "@std/expect";

// Extends the `Expected` interface with your new matchers signatures
export interface ExtendedExpected<IsAsync = false> extends Expected<IsAsync> {
    // Matcher that asserts value is a dinosaur
    toDeepEqual: (pTarget: object) => unknown;

    // NOTE: You also need to overrides the following typings to allow modifiers to correctly infer typing
    not: IsAsync extends true ? Async<ExtendedExpected<true>> : ExtendedExpected<false>;
    resolves: Async<ExtendedExpected<true>>;
    rejects: Async<ExtendedExpected<true>>;
}