import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { Graph } from '../source/graph/graph.ts';
import { GraphNode } from '../source/index.ts';
import { CodeParserTrace } from "../source/parser/code-parser-trace.ts";

describe('CodeParserTrace', () => {
    describe('Property: incidents', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);
            const lError: string = 'Test error';
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

        it('-- Default error not an Error object', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);
            const lError: string = 'Test error';
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
            const lException: CodeParserTrace<string> = new CodeParserTrace(false);

            // Process & Evaluation.
            expect(() => lException.incidents).toThrow('A complete incident list is only available on debug mode.');
        });
    });

    describe('Property: graph', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);
            const lError: string = 'Test error';
            const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });

            // Process.
            lException.push(lError, lGraph, 1, 1, 2, 2);

            // Evaluation.
            expect(lException.graph).toBe(lGraph);
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);

            // Evaluation.
            expect(lException.graph).toBeNull();
        });
    });

    describe('Property: message', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);
            const lError: string = 'Test error';

            // Process.
            lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

            // Evaluation.
            expect(lException.message).toBe('Test error');
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);

            // Evaluation.
            expect(lException.message).toBe('Unknown parser error');
        });
    });

    describe('Property: lineStart', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);
            const lError: string = 'Test error';

            // Process.
            lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

            // Evaluation.
            expect(lException.lineStart).toBe(1);
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);

            // Evaluation.
            expect(lException.lineStart).toBe(1);
        });
    });

    describe('Property: columnStart', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);
            const lError: string = 'Test error';

            // Process.
            lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

            // Evaluation.
            expect(lException.columnStart).toBe(1);
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);

            // Evaluation.
            expect(lException.columnStart).toBe(1);
        });
    });

    describe('Property: lineEnd', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);
            const lError: string = 'Test error';

            // Process.
            lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

            // Evaluation.
            expect(lException.lineEnd).toBe(2);
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);

            // Evaluation.
            expect(lException.lineEnd).toBe(1);
        });
    });

    describe('Property: columnEnd', () => {
        it('-- Default', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);
            const lError: string = 'Test error';

            // Process.
            lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

            // Evaluation.
            expect(lException.columnEnd).toBe(2);
        });

        it('-- No incidents', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);

            // Evaluation.
            expect(lException.columnEnd).toBe(1);
        });
    });

    describe('Method: push', () => {
        it('-- Single Default', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);
            const lError: string = 'Test error';
            const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });
            const lStartLine: number = 1;
            const lStartColumn: number = 1;
            const lEndLine: number = 2;
            const lEndColumn: number = 2;

            // Process.
            lException.push(lError, lGraph, lStartLine, lStartColumn, lEndLine, lEndColumn);

            // Evaluation.
            expect(lException.message).toBe(lError);
            expect(lException.graph).toBe(lGraph);
            expect(lException.lineStart).toBe(lStartLine);
            expect(lException.columnStart).toBe(lStartColumn);
            expect(lException.lineEnd).toBe(lEndLine);
            expect(lException.columnEnd).toBe(lEndColumn);
        });

        it('-- Priority is higher', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);
            const lError1Message: string = 'Test error';
            const lError2Message: string = 'Test error';
            const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });

            // Process.
            lException.push(lError1Message, lGraph, 1, 1, 2, 3);
            lException.push(lError2Message, lGraph, 1, 1, 2, 2);

            // Evaluation.
            expect(lException.message).toBe(lError1Message);
        });

        it('-- Priority is lower', () => {
            // Setup.
            const lException: CodeParserTrace<string> = new CodeParserTrace(true);
            const lError1Message: string = 'Test error';
            const lError2Message: string = 'Test error';
            const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });

            // Process.
            lException.push(lError1Message, lGraph, 1, 1, 2, 2);
            lException.push(lError2Message, lGraph, 1, 1, 2, 3);

            // Evaluation.
            expect(lException.message).toBe(lError2Message);
        });
    });
});