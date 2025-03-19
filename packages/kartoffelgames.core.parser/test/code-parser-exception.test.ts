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
            const lStartLine: number = 1;
            const lStartColumn: number = 1;
            const lEndLine: number = 2;
            const lEndColumn: number = 2;

            // Process.
            lException.push(lError, lGraph, lStartLine, lStartColumn, lEndLine, lEndColumn);

            // Evaluation.
            expect(lException.top.error).toBe(lError);
            expect(lException.top.graph).toBe(lGraph);
            expect(lException.top.range.lineStart).toBe(lStartLine);
            expect(lException.top.range.columnStart).toBe(lStartColumn);
            expect(lException.top.range.lineEnd).toBe(lEndLine);
            expect(lException.top.range.columnEnd).toBe(lEndColumn);
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
            const lStartLine: number = 1;
            const lStartColumn: number = 1;
            const lEndLine: number = 2;
            const lEndColumn: number = 2;

            // Process.
            lException.push(lError, lGraph, lStartLine, lStartColumn, lEndLine, lEndColumn);

            // Evaluation.
            expect(lException.incidents).toHaveLength(1);
            expect(lException.incidents[0].error).toBe(lError);
            expect(lException.incidents[0].graph).toBe(lGraph);
            expect(lException.top.range.lineStart).toBe(lStartLine);
            expect(lException.top.range.columnStart).toBe(lStartColumn);
            expect(lException.top.range.lineEnd).toBe(lEndLine);
            expect(lException.top.range.columnEnd).toBe(lEndColumn);
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
        const lStartLine1: number = 1;
        const lStartColumn1: number = 1;
        const lEndLine1: number = 2;
        const lEndColumn1: number = 2;
        const lStartLine2: number = 3;
        const lStartColumn2: number = 3;
        const lEndLine2: number = 4;
        const lEndColumn2: number = 4;


        // Process.
        lException1.push(lError1, lGraph, lStartLine1, lStartColumn1, lEndLine1, lEndColumn1);
        lException2.push(lError2, lGraph, lStartLine2, lStartColumn2, lEndLine2, lEndColumn2);
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
            const lStartLine: number = 1;
            const lStartColumn: number = 1;
            const lEndLine: number = 2;
            const lEndColumn: number = 2;

            // Process.
            lException.push(lError, lGraph, lStartLine, lStartColumn, lEndLine, lEndColumn);

            // Evaluation.
            expect(lException.top.error).toBe(lError);
            expect(lException.top.graph).toBe(lGraph);
            expect(lException.top.range.lineStart).toBe(lStartLine);
            expect(lException.top.range.columnStart).toBe(lStartColumn);
            expect(lException.top.range.lineEnd).toBe(lEndLine);
            expect(lException.top.range.columnEnd).toBe(lEndColumn);
        });

        it('-- Priority is higher', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError1: Error = new Error('Test error');
            const lError2: Error = new Error('Test error');
            const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });

            // Process.
            lException.push(lError1, lGraph, 1, 1, 2, 3);
            lException.push(lError2, lGraph, 1, 1, 2, 2);

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
            lException.push(lError1, lGraph, 1, 1, 2, 2);
            lException.push(lError2, lGraph, 1, 1, 2, 3);

            // Evaluation.
            expect(lException.top.error).toBe(lError2);
        });
    });
});