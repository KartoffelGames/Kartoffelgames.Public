import { Exception } from '@kartoffelgames/core';
import { expect } from 'chai';
import { GraphException, GraphParseError } from '../../source/exception/graph-exception';
import { LexerToken } from '../../source/lexer/lexer-token';

describe('GrapthException', () => {
    it('Property: errorCount', () => {
        // Setup.
        const lError: GraphException<string> = new GraphException();
        lError.appendError('Message1', new LexerToken('Type', 'Value', 1, 1));
        lError.appendError('Message2', new LexerToken('Type', 'Value', 1, 2));

        // Process.
        const lErrorCount: number = lError.errorCount;

        // Evaluation.
        expect(lErrorCount).to.equal(2);
    });

    it('Method: appendError', () => {
        // Setup.
        const lError: GraphException<string> = new GraphException();

        // Process.
        lError.appendError('Message1', new LexerToken('Type', 'Value', 1, 1));
        lError.appendError('Message2', new LexerToken('Type', 'Value', 1, 2));

        // Evaluation.
        expect(lError.errorCount).to.equal(2);
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
        expect(lError.errorCount).to.equal(4);
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
            expect(lGraphError.message).to.equal(lErrorMessage);
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
            expect(lGraphError.message).to.equal(lErrorMessage);
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
            expect(lGraphError.message).to.equal(lErrorMessage);
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
            expect(lGraphError.message).to.equal(lErrorMessage);
        });

        it('-- Only undefined token, take last.', () => {
            // Setup.
            const lErrorMessage: string = 'Message1';
            const lError: GraphException<string> = new GraphException();
            lError.appendError('Message2', undefined);
            lError.appendError(lErrorMessage, undefined);

            // Process.
            const lGraphError: GraphParseError<string> = lError.mostRelevant();

            // Evaluation.
            expect(lGraphError.message).to.equal(lErrorMessage);
        });

        it('-- Undefined token, take none undefined.', () => {
            // Setup.
            const lErrorMessage: string = 'Message1';
            const lError: GraphException<string> = new GraphException();
            lError.appendError(lErrorMessage, new LexerToken('Type', 'Value', 1, 2));
            lError.appendError('Message2', undefined);

            // Process.
            const lGraphError: GraphParseError<string> = lError.mostRelevant();

            // Evaluation.
            expect(lGraphError.message).to.equal(lErrorMessage);
        });

        it('-- No attached errors', () => {
            // Setup.
            const lError: GraphException<string> = new GraphException();

            // Process.
            const lErrorFunction = () => {
                lError.mostRelevant();
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(Exception, 'No error attached to graph exception.');
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
            expect(lError.errorCount).to.equal(2);
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
            expect(lErrorFunction).to.throw(Exception, lMessage);
        });
    });

});