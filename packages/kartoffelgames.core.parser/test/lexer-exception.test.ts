import { expect } from '@kartoffelgames/core-test';
import { LexerException } from '../source/lexer/lexer-exception.ts';

Deno.test('LexerException.columnEnd', () => {
    // Process.
    const lValue: number = 5505;
    const lError: LexerException<null> = new LexerException('Message', null, 11, 22, lValue, 44);

    // Process.
    const lColumnEnd: number = lError.columnEnd;

    // Evaluation.
    expect(lColumnEnd).toBe(lValue);
});

Deno.test('LexerException.columnStart', () => {
    // Process.
    const lValue: number = 5505;
    const lError: LexerException<null> = new LexerException('Message', null, lValue, 22, 33, 44);

    // Process.
    const lColumnStart: number = lError.columnStart;

    // Evaluation.
    expect(lColumnStart).toBe(lValue);
});

Deno.test('LexerException.lineEnd', () => {
    // Process.
    const lValue: number = 5505;
    const lError: LexerException<null> = new LexerException('Message', null, 11, 22, 33, lValue);

    // Process.
    const lLineEnd: number = lError.lineEnd;

    // Evaluation.
    expect(lLineEnd).toBe(lValue);
});

Deno.test('LexerException.lineStart', () => {
    // Process.
    const lValue: number = 5505;
    const lError: LexerException<null> = new LexerException('Message', null, 11, lValue, 33, 44);

    // Process.
    const lLineStart: number = lError.lineStart;

    // Evaluation.
    expect(lLineStart).toBe(lValue);
});