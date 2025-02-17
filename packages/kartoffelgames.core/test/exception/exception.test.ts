import { describe, it } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { Exception } from '../../source/exception/exception.ts';

describe('Exception', () => {
    it('Property: target', () => {
        // Setup.
        const lTarget: string = 'Target';
        const lException: Exception<string> = new Exception('Message', lTarget);

        // Process.
        const lExceptionTarget: string = lException.target;

        // Evaluation.
        expect(lException.target).toBe(lExceptionTarget);
    });
});