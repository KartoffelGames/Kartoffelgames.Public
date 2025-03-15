import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { Exception } from '@kartoffelgames/core';
import { GraphException, type GraphParseError } from '../source/exception/graph-exception.ts';
import { LexerToken } from '../source/lexer/lexer-token.ts';

describe('GrapthException', () => {
    it('Property: errorCount', () => {
        // Setup.
        const lError: GraphException<string> = new GraphException();
        lError.appendError('Message1', new LexerToken('Type', 'Value', 1, 1));
        lError.appendError('Message2', new LexerToken('Type', 'Value', 1, 2));

        // Process.
        const lErrorCount: number = lError.errorCount;

        // Evaluation.
        expect(lErrorCount).toBe(2);
    });

    it('Method: appendError', () => {
        // Setup.
        const lError: GraphException<string> = new GraphException();

        // Process.
        lError.appendError('Message1', new LexerToken('Type', 'Value', 1, 1));
        lError.appendError('Message2', new LexerToken('Type', 'Value', 1, 2));

        // Evaluation.
        expect(lError.errorCount).toBe(2);
    });

    it('Method: merge', () => {
        // Setup.
        const lError: GraphException<string> = new GraphException();
        lError.appendError('Message1', new LexerToken('Type', 'Value', 1, 1));
        lError.appendError('Message2', new LexerToken('Type', 'Value', 1, 2));

        const lErrorTwo: GraphException<string> = new GraphException();
        lErrorTwo.appendError('Message3', new LexerToken('Type', 'Value', 1, 3));
        lErrorTwo.appendError('Message4', new LexerToken('Type', 'Value', 1, 4));

        // Process.
        lError.merge(lErrorTwo);

        // Evaluation.
        expect(lError.errorCount).toBe(4);
    });

    describe('Method: mostRelevant', () => {
        it('-- Single error.', () => {
            // Setup.
            const lErrorMessage: string = 'Message1';
            const lError: GraphException<string> = new GraphException();
            lError.appendError(lErrorMessage, new LexerToken('Type', 'Value', 1, 1));

            // Process.
            const lGraphError: GraphParseError<string> = lError.mostRelevant();

            // Evaluation.
            expect(lGraphError.message).toBe(lErrorMessage);
        });

        it('-- Two errors positive priority order.', () => {
            // Setup.
            const lErrorMessage: string = 'Message1';
            const lError: GraphException<string> = new GraphException();
            lError.appendError('Message2', new LexerToken('Type', 'Value', 1, 1));
            lError.appendError(lErrorMessage, new LexerToken('Type', 'Value', 1, 2));

            // Process.
            const lGraphError: GraphParseError<string> = lError.mostRelevant();

            // Evaluation.
            expect(lGraphError.message).toBe(lErrorMessage);
        });

        it('-- Two errors negative priority order.', () => {
            // Setup.
            const lErrorMessage: string = 'Message1';
            const lError: GraphException<string> = new GraphException();
            lError.appendError(lErrorMessage, new LexerToken('Type', 'Value', 1, 2));
            lError.appendError('Message2', new LexerToken('Type', 'Value', 1, 1));

            // Process.
            const lGraphError: GraphParseError<string> = lError.mostRelevant();

            // Evaluation.
            expect(lGraphError.message).toBe(lErrorMessage);
        });

        it('-- Priorize lines over columns', () => {
            // Setup.
            const lErrorMessage: string = 'Message1';
            const lError: GraphException<string> = new GraphException();
            lError.appendError('Message2', new LexerToken('Type', 'Value', 800, 1));
            lError.appendError(lErrorMessage, new LexerToken('Type', 'Value', 1, 2));

            // Process.
            const lGraphError: GraphParseError<string> = lError.mostRelevant();

            // Evaluation.
            expect(lGraphError.message).toBe(lErrorMessage);
        });

        it('-- Only undefined token, take last.', () => {
            // Setup.
            const lErrorMessage: string = 'Message1';
            const lError: GraphException<string> = new GraphException();
            lError.appendError('Message2', null);
            lError.appendError(lErrorMessage, null);

            // Process.
            const lGraphError: GraphParseError<string> = lError.mostRelevant();

            // Evaluation.
            expect(lGraphError.message).toBe(lErrorMessage);
        });

        it('-- Undefined token, take none undefined.', () => {
            // Setup.
            const lErrorMessage: string = 'Message1';
            const lError: GraphException<string> = new GraphException();
            lError.appendError(lErrorMessage, new LexerToken('Type', 'Value', 1, 2));
            lError.appendError('Message2', null);

            // Process.
            const lGraphError: GraphParseError<string> = lError.mostRelevant();

            // Evaluation.
            expect(lGraphError.message).toBe(lErrorMessage);
        });

        it('-- No attached errors', () => {
            // Setup.
            const lError: GraphException<string> = new GraphException();

            // Process.
            const lErrorFunction = () => {
                lError.mostRelevant();
            };

            // Evaluation.
            expect(lErrorFunction).toThrow('No error attached to graph exception.');
        });
    });

    describe('Method: onErrorMergeAndContinue', () => {
        it('-- Throw GraphException', () => {
            // Setup.
            const lError: GraphException<string> = new GraphException();

            // Process.
            lError.onErrorMergeAndContinue(() => {
                const lErrorTwo: GraphException<string> = new GraphException();
                lErrorTwo.appendError('Message3', new LexerToken('Type', 'Value', 1, 3));
                lErrorTwo.appendError('Message4', new LexerToken('Type', 'Value', 1, 4));

                throw lErrorTwo;
            });

            // Evaluation.
            expect(lError.errorCount).toBe(2);
        });

        it('-- Throw none GraphException', () => {
            // Setup.
            const lMessage: string = 'Original and cool error message';
            const lError: GraphException<string> = new GraphException();

            // Process.
            const lErrorFunction = () => {
                lError.onErrorMergeAndContinue(() => {
                    throw new Exception(lMessage, null);
                });
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(lMessage);
        });
    });

});