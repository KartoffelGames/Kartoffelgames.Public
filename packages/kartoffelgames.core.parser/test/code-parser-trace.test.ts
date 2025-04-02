import { expect } from '@kartoffelgames/core-test';
import { Graph } from '../source/parser/graph/graph.ts';
import { GraphNode } from '../source/index.ts';
import { CodeParserTrace } from '../source/parser/code-parser-trace.ts';

Deno.test('CodeParserTrace.incidents', async (pContext) => {
    await pContext.step('Default', () => {
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
        expect(lException.incidents[0].message).toBe(lError);
        expect(lException.incidents[0].graph).toBe(lGraph);
        expect(lException.incidents[0].range.lineStart).toBe(lStartLine);
        expect(lException.incidents[0].range.columnStart).toBe(lStartColumn);
        expect(lException.incidents[0].range.lineEnd).toBe(lEndLine);
        expect(lException.incidents[0].range.columnEnd).toBe(lEndColumn);
    });

    await pContext.step('Default error not an Error object', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);
        const lError: string = 'Test error';
        const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });
        const lStartLine: number = 1;
        const lStartColumn: number = 1;

        // Process.
        lException.push(lError, lGraph, lStartLine, lStartColumn, 2, 2);

        // Evaluation.
        expect(lException.incidents).toHaveLength(1);
        expect(lException.incidents[0].message).toBe(lError);
    });

    await pContext.step('Throws exception when not in debug mode', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(false);

        // Process & Evaluation.
        expect(() => lException.incidents).toThrow('A complete incident list is only available on debug mode.');
    });
});

Deno.test('CodeParserTrace.top.graph', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);
        const lError: string = 'Test error';
        const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });

        // Process.
        lException.push(lError, lGraph, 1, 1, 2, 2);

        // Evaluation.
        expect(lException.top.graph).toBe(lGraph);
    });

    await pContext.step('No incidents', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);

        // Evaluation.
        expect(lException.top.graph).toBeNull();
    });
});

Deno.test('CodeParserTrace.top.message', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);
        const lError: string = 'Test error';

        // Process.
        lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

        // Evaluation.
        expect(lException.top.message).toBe('Test error');
    });

    await pContext.step('No incidents', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);

        // Evaluation.
        expect(lException.top.message).toBe('Unknown parser error');
    });
});

Deno.test('CodeParserTrace.top.range.lineStart', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);
        const lError: string = 'Test error';

        // Process.
        lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

        // Evaluation.
        expect(lException.top.range.lineStart).toBe(1);
    });

    await pContext.step('No incidents', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);

        // Evaluation.
        expect(lException.top.range.lineStart).toBe(1);
    });
});

Deno.test('CodeParserTrace.top.range.columnStart', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);
        const lError: string = 'Test error';

        // Process.
        lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

        // Evaluation.
        expect(lException.top.range.columnStart).toBe(1);
    });

    await pContext.step('No incidents', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);

        // Evaluation.
        expect(lException.top.range.columnStart).toBe(1);
    });
});

Deno.test('CodeParserTrace.top.range.lineEnd', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);
        const lError: string = 'Test error';

        // Process.
        lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

        // Evaluation.
        expect(lException.top.range.lineEnd).toBe(2);
    });

    await pContext.step('No incidents', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);

        // Evaluation.
        expect(lException.top.range.lineEnd).toBe(1);
    });
});

Deno.test('CodeParserTrace.top.range.columnEnd', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);
        const lError: string = 'Test error';

        // Process.
        lException.push(lError, Graph.define(() => { return GraphNode.new<string>(); }), 1, 1, 2, 2);

        // Evaluation.
        expect(lException.top.range.columnEnd).toBe(2);
    });

    await pContext.step('No incidents', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);

        // Evaluation.
        expect(lException.top.range.columnEnd).toBe(1);
    });
});

Deno.test('CodeParserTrace.push()', async (pContext) => {
    await pContext.step('Single Default', () => {
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
        expect(lException.top.message).toBe(lError);
        expect(lException.top.graph).toBe(lGraph);
        expect(lException.top.range.lineStart).toBe(lStartLine);
        expect(lException.top.range.columnStart).toBe(lStartColumn);
        expect(lException.top.range.lineEnd).toBe(lEndLine);
        expect(lException.top.range.columnEnd).toBe(lEndColumn);
    });

    await pContext.step('Priority is higher', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);
        const lError1Message: string = 'Test error';
        const lError2Message: string = 'Test error';
        const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });

        // Process.
        lException.push(lError1Message, lGraph, 1, 1, 2, 3);
        lException.push(lError2Message, lGraph, 1, 1, 2, 2);

        // Evaluation.
        expect(lException.top.message).toBe(lError1Message);
    });

    await pContext.step('Priority is lower', () => {
        // Setup.
        const lException: CodeParserTrace<string> = new CodeParserTrace(true);
        const lError1Message: string = 'Test error';
        const lError2Message: string = 'Test error';
        const lGraph: Graph<string> = Graph.define(() => { return GraphNode.new<string>(); });

        // Process.
        lException.push(lError1Message, lGraph, 1, 1, 2, 2);
        lException.push(lError2Message, lGraph, 1, 1, 2, 3);

        // Evaluation.
        expect(lException.top.message).toBe(lError2Message);
    });
});