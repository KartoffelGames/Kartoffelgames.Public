import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { TypeUtil } from '../../source/util/type-util.ts';

describe('TypeUtil', () => {
    it('Static Method: nameOf', () => {
        // Setup.
        class TestClass {
            public testMethod(): void {/** Empty */ }
        }

        // Process.
        const lMethodName: string = TypeUtil.nameOf<TestClass>('testMethod');

        // Evaluation.
        expect(lMethodName).toBe('testMethod');
    });
});