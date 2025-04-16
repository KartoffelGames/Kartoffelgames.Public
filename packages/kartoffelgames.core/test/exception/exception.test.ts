import { expect } from '@std/expect';
import { Exception } from '../../source/exception/exception.ts';

Deno.test('Exception.target', async (pContext) => {
    await pContext.step('should return the target of the exception', () => {
        // Setup.
        const lTarget: string = 'Target';
        const lException: Exception<string> = new Exception('Message', lTarget);

        // Process.
        const lExceptionTarget: string = lException.target;

        // Evaluation.
        expect(lException.target).toBe(lExceptionTarget);
    });
});