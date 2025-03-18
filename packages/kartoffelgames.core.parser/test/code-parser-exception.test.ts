import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { CodeParserException } from '../source/exception/code-parser-exception.ts';
import { Graph } from '../source/graph/graph.ts';
import { GraphNode } from "../source/index.ts";
import { LexerToken } from '../source/lexer/lexer-token.ts';

describe('CodeParserException', () => {
    describe('Property: top', () => {
        it('-- default', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError: Error = new Error('Test error');
            const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });
            const lStartToken: LexerToken<string> = new LexerToken('Type', 'Value', 1, 1);
            const lEndToken: LexerToken<string> = new LexerToken('Type', 'Value', 2, 2);

            // Process.
            lException.push(lError, lGraph, lStartToken, lEndToken);

            // Evaluation.
            expect(lException.top.error).toBe(lError);
            expect(lException.top.graph).toBe(lGraph);
            expect(lException.top.token.start).toBe(lStartToken);
            expect(lException.top.token.end).toBe(lEndToken);
        });

        it('Property: top throws exception when no incidents are available', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);

            // Process & Evaluation.
            expect(() => lException.top).toThrow('No incidents are available');
        });
    });

    describe('Property: incidents', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError: Error = new Error('Test error');
            const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });
            const lStartToken: LexerToken<string> = new LexerToken('Type', 'Value', 1, 1);
            const lEndToken: LexerToken<string> = new LexerToken('Type', 'Value', 2, 2);

            // Process.
            lException.push(lError, lGraph, lStartToken, lEndToken);

            // Evaluation.
            expect(lException.incidents).toHaveLength(1);
            expect(lException.incidents[0].error).toBe(lError);
            expect(lException.incidents[0].graph).toBe(lGraph);
            expect(lException.incidents[0].token.start).toBe(lStartToken);
            expect(lException.incidents[0].token.end).toBe(lEndToken);
        });

        it('Property: incidents throws exception when not in debug mode', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(false);

            // Process & Evaluation.
            expect(() => lException.incidents).toThrow('A complete incident list is only available on debug mode.');
        });
    });

    it('Method: integrate', () => {
        // Setup.
        const lException1: CodeParserException<string> = new CodeParserException(true);
        const lException2: CodeParserException<string> = new CodeParserException(true);
        const lError1: Error = new Error('Test error 1');
        const lError2: Error = new Error('Test error 2');
        const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });
        const lStartToken1: LexerToken<string> = new LexerToken('Type', 'Value', 1, 1);
        const lEndToken1: LexerToken<string> = new LexerToken('Type', 'Value', 2, 2);
        const lStartToken2: LexerToken<string> = new LexerToken('Type', 'Value', 3, 3);
        const lEndToken2: LexerToken<string> = new LexerToken('Type', 'Value', 4, 4);

        // Process.
        lException1.push(lError1, lGraph, lStartToken1, lEndToken1);
        lException2.push(lError2, lGraph, lStartToken2, lEndToken2);
        lException1.integrate(lException2);

        // Evaluation.
        expect(lException1.incidents).toHaveLength(2);
        expect(lException1.top.error).toBe(lError2);
    });

    describe('Method: push', () => {
        it('-- Single Default', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError: Error = new Error('Test error');
            const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });
            const lStartToken: LexerToken<string> = new LexerToken('Type', 'Value', 1, 1);
            const lEndToken: LexerToken<string> = new LexerToken('Type', 'Value', 2, 2);

            // Process.
            lException.push(lError, lGraph, lStartToken, lEndToken);

            // Evaluation.
            expect(lException.top.error).toBe(lError);
            expect(lException.top.graph).toBe(lGraph);
            expect(lException.top.token.start).toBe(lStartToken);
            expect(lException.top.token.end).toBe(lEndToken);
        });

        it('-- Priority is higher', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError1: Error = new Error('Test error');
            const lError2: Error = new Error('Test error');
            const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });

            // Process.
            lException.push(lError1, lGraph, new LexerToken('Type', 'Value', 1, 1), new LexerToken('Type', 'Value', 2, 3));
            lException.push(lError2, lGraph, new LexerToken('Type', 'Value', 1, 1), new LexerToken('Type', 'Value', 2, 2));

            // Evaluation.
            expect(lException.top.error).toBe(lError1);
        });

        it('-- Priority is lower', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError1: Error = new Error('Test error');
            const lError2: Error = new Error('Test error');
            const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });

            // Process.
            lException.push(lError1, lGraph, new LexerToken('Type', 'Value', 1, 1), new LexerToken('Type', 'Value', 2, 2));
            lException.push(lError2, lGraph, new LexerToken('Type', 'Value', 1, 1), new LexerToken('Type', 'Value', 2, 3));

            // Evaluation.
            expect(lException.top.error).toBe(lError2);
        });
    });


});