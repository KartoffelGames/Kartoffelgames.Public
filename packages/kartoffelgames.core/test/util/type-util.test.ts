import { expect } from '@std/expect';
import { TypeUtil } from '../../source/util/type-util.ts';

Deno.test('TypeUtil.nameOf()', () => {
    // Setup.
    class TestClass {
        public testMethod(): void {/** Empty */ }
    }

    // Process.
    const lMethodName: string = TypeUtil.nameOf<TestClass>('testMethod');

    // Evaluation.
    expect(lMethodName).toBe('testMethod');
});