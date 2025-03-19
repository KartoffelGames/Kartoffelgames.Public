import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { CodeParserException } from '../source/exception/code-parser-exception.ts';
import { Graph } from '../source/graph/graph.ts';
import { GraphNode } from "../source/index.ts";

describe('CodeParserException', () => {
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
            expect(lException.lineStart).toBe(lStartLine);
            expect(lException.columnStart).toBe(lStartColumn);
            expect(lException.lineEnd).toBe(lEndLine);
            expect(lException.columnEnd).toBe(lEndColumn);
        });

        it('Property: incidents throws exception when not in debug mode', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(false);

            // Process & Evaluation.
            expect(() => lException.incidents).toThrow('A complete incident list is only available on debug mode.');
        });
    });

    describe('Property: affectedGraph', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError: Error = new Error('Test error');
            const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });

            // Process.
            lException.push(lError, lGraph, 1, 1, 2, 2);

            // Evaluation.
            expect(lException.affectedGraph).toBe(lGraph);
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);

            // Evaluation.
            expect(lException.affectedGraph).toBeNull();
        });
    });

    describe('Property: message', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError: Error = new Error('Test error');

            // Process.
            lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

            // Evaluation.
            expect(lException.message).toBe('Test error');
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);

            // Evaluation.
            expect(lException.message).toBe('Unknown parser error');
        });
    });

    describe('Property: cause', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError: Error = new Error('Test error');

            // Process.
            lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

            // Evaluation.
            expect(lException.cause).toBe(lError);
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);

            // Evaluation.
            expect(lException.cause).toBeUndefined();
        });
    });

    describe('Property: lineStart', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError: Error = new Error('Test error');

            // Process.
            lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

            // Evaluation.
            expect(lException.lineStart).toBe(1);
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);

            // Evaluation.
            expect(lException.lineStart).toBe(1);
        });
    });

    describe('Property: columnStart', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError: Error = new Error('Test error');

            // Process.
            lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

            // Evaluation.
            expect(lException.columnStart).toBe(1);
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);

            // Evaluation.
            expect(lException.columnStart).toBe(1);
        });
    });

    describe('Property: lineEnd', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError: Error = new Error('Test error');

            // Process.
            lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

            // Evaluation.
            expect(lException.lineEnd).toBe(2);
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);

            // Evaluation.
            expect(lException.lineEnd).toBe(1);
        });
    });

    describe('Property: columnEnd', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);
            const lError: Error = new Error('Test error');

            // Process.
            lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

            // Evaluation.
            expect(lException.columnEnd).toBe(2);
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserException<string> = new CodeParserException(true);

            // Evaluation.
            expect(lException.columnEnd).toBe(1);
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
        expect(lException1.cause).toBe(lError2);
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
            expect(lException.cause).toBe(lError);
            expect(lException.affectedGraph).toBe(lGraph);
            expect(lException.lineStart).toBe(lStartLine);
            expect(lException.columnStart).toBe(lStartColumn);
            expect(lException.lineEnd).toBe(lEndLine);
            expect(lException.columnEnd).toBe(lEndColumn);
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
            expect(lException.cause).toBe(lError1);
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
            expect(lException.cause).toBe(lError2);
        });
    });
});