import { expect } from '@kartoffelgames/core-test';
import { LexerToken } from '../source/lexer/lexer-token.ts';
import { CodeParserProcessState } from "../source/parser/code-parser-process-state.ts";
import { GraphNode } from '../source/parser/graph/graph-node.ts';
import { Graph } from '../source/parser/graph/graph.ts';

/**
 * Generates a mock state that simulates the behavior of a code parser process state.
 * 
 * @param pStartToken - LexerToken<string> | null
 * @param pEndToken - LexerToken<string> | null
 */
const generateState = (pStartToken?: LexerToken<string>, pEndToken?: LexerToken<string>): CodeParserProcessState<string> => {
    // Generate a mock state that simulates the behavior of a code parser process state.
    return new (class {
        public getGraphBoundingToken(): [LexerToken<string> | undefined, LexerToken<string> | undefined] {
            return [pStartToken ?? pEndToken, pEndToken ?? pStartToken];
        }
    }) as CodeParserProcessState<string>;
};

Deno.test('Graph.define()', async (pContext) => {
    await pContext.step('Create graph with node collector', () => {
        // Setup.
        const lNodeCollector = () => GraphNode.new<string>().required('key', 'value');

        // Process.
        const lGraph = Graph.define(lNodeCollector);

        // Evaluation.
        expect(lGraph).toBeInstanceOf(Graph as any);
        expect(lGraph.node).toBeInstanceOf(GraphNode as any);
    });
});

Deno.test('Graph.node', async (pContext) => {
    await pContext.step('Get root node of graph', () => {
        // Setup.
        const lNodeCollector = () => GraphNode.new<string>().required('key', 'value');
        const lGraph = Graph.define(lNodeCollector);

        // Process.
        const lNode = lGraph.node;

        // Evaluation.
        expect(lNode).toBeInstanceOf(GraphNode as any);
        expect(lNode.configuration.dataKey).toBe('key');
    });

    await pContext.step('Cache resolved root node', () => {
        // Setup.
        let lCallCount = 0;
        const lNodeCollector = () => {
            lCallCount++;
            return GraphNode.new<string>().required('key', 'value');
        };
        const lGraph = Graph.define(lNodeCollector);

        // Process.
        const lFirstNode = lGraph.node;
        const lSecondNode = lGraph.node;

        // Evaluation.
        expect(lCallCount).toBe(1);
        expect(lFirstNode).toBe(lSecondNode);
    });
});

Deno.test('Graph.convert()', async (pContext) => {
    await pContext.step('Convert data without converters', () => {
        // Setup.
        const lGraph = Graph.define(() => GraphNode.new<string>());
        const lRawData = { key: 'value' };

        // Process.
        const lResult = lGraph.convert(lRawData, generateState(undefined, undefined));

        // Evaluation.
        expect(lResult).toBe(lRawData);
    });

    await pContext.step('Apply single converter to raw data', () => {
        // Setup.
        const lGraph = Graph.define(() => GraphNode.new<string>())
            .converter((pData) => ({ ...pData, extra: 'added' }));
        const lRawData = { key: 'value' };

        // Process.
        const lResult = lGraph.convert(lRawData, generateState(undefined, undefined));

        // Evaluation.
        expect(lResult).toHaveProperty('key', 'value');
        expect(lResult).toHaveProperty('extra', 'added');
    });

    await pContext.step('Apply multiple converters in sequence', () => {
        // Setup.
        const lGraph = Graph.define(() => GraphNode.new<string>())
            .converter((pData) => ({ ...pData, step1: true }))
            .converter((pData) => ({ ...pData, step2: true }));
        const lRawData = { key: 'value' };

        // Process.
        const lResult = lGraph.convert(lRawData, generateState(undefined, undefined));

        // Evaluation.
        expect(lResult).toHaveProperty('key', 'value');
        expect(lResult).toHaveProperty('step1', true);
        expect(lResult).toHaveProperty('step2', true);
    });

    await pContext.step('Stop processing converters when symbol is returned', () => {
        // Setup.
        const lGraph = Graph.define(() => GraphNode.new<string>())
            .converter(() => Symbol('error'))
            .converter(() => ({ key: 'value' }));
        const lRawData = { key: 'value' };

        // Process.
        const lResult = lGraph.convert(lRawData, generateState(undefined, undefined));

        // Evaluation.
        expect(typeof lResult).toBe('symbol');
    });

    await pContext.step('Pass tokens to converter - both undefined', () => {
        // Setup.
        let lPassedStartToken: LexerToken<string> | undefined | null = null;
        let lPassedEndToken: LexerToken<string> | undefined | null = null;

        // Process.
        const lGraph = Graph.define(() => GraphNode.new<string>())
            .converter((pData, pStartToken, pEndToken) => {
                lPassedStartToken = pStartToken;
                lPassedEndToken = pEndToken;
                return pData;
            });
        lGraph.convert({}, generateState(undefined, undefined));

        // Evaluation.
        expect(lPassedStartToken).toBeUndefined();
        expect(lPassedEndToken).toBeUndefined();
    });

    await pContext.step('Pass tokens to converter - start token undefined', () => {
        // Setup.
        const lReceivedEndToken: LexerToken<string> = new LexerToken<string>('testType', 'testValue', 1, 1);
        let lPassedStartToken: LexerToken<string> | undefined | null = null;
        let lPassedEndToken: LexerToken<string> | undefined | null = null;

        // Process.
        const lGraph = Graph.define(() => GraphNode.new<string>())
            .converter((pData, pStartToken, pEndToken) => {
                lPassedStartToken = pStartToken;
                lPassedEndToken = pEndToken;
                return pData;
            });
        lGraph.convert({}, generateState(undefined, lReceivedEndToken));

        // Evaluation.
        expect(lPassedStartToken).toBe(lReceivedEndToken);
        expect(lPassedEndToken).toBe(lReceivedEndToken);
    });

    await pContext.step('Pass tokens to converter - end token undefined', () => {
        // Setup.
        const lReceivedStartToken: LexerToken<string> = new LexerToken<string>('testType', 'testValue', 1, 1);
        let lPassedStartToken: LexerToken<string> | undefined | null = null;
        let lPassedEndToken: LexerToken<string> | undefined | null = null;

        // Process.
        const lGraph = Graph.define(() => GraphNode.new<string>())
            .converter((pData, pStartToken, pEndToken) => {
                lPassedStartToken = pStartToken;
                lPassedEndToken = pEndToken;
                return pData;
            });
        lGraph.convert({}, generateState(lReceivedStartToken, undefined));

        // Evaluation.
        expect(lPassedStartToken).toBe(lReceivedStartToken);
        expect(lPassedEndToken).toBe(lReceivedStartToken);
    });

    await pContext.step('Pass tokens to converter - both tokens present', () => {
        // Setup.
        const lReceivedStartToken: LexerToken<string> = new LexerToken<string>('startType', 'startValue', 1, 1);
        const lReceivedEndToken: LexerToken<string> = new LexerToken<string>('endType', 'endValue', 2, 2);
        let lPassedStartToken: LexerToken<string> | undefined | null = null;
        let lPassedEndToken: LexerToken<string> | undefined | null = null;

        // Process.
        const lGraph = Graph.define(() => GraphNode.new<string>())
            .converter((pData, pStartToken, pEndToken) => {
                lPassedStartToken = pStartToken;
                lPassedEndToken = pEndToken;
                return pData;
            });
        lGraph.convert({}, generateState(lReceivedStartToken, lReceivedEndToken));

        // Evaluation.
        expect(lPassedStartToken).toBe(lReceivedStartToken);
        expect(lPassedEndToken).toBe(lReceivedEndToken);
    });
});

Deno.test('Graph.converter()', async (pContext) => {
    await pContext.step('Add new data converter to graph', () => {
        // Setup.
        const lGraph = Graph.define(() => GraphNode.new<string>());

        // Process.
        const lNewGraph = lGraph.converter((pData) => ({ ...pData, extra: 'added' }));

        // Evaluation.
        expect(lNewGraph).not.toBe(lGraph);
        expect(lNewGraph.convert({ key: 'value' }, generateState(undefined, undefined))).toHaveProperty('extra', 'added');
    });

    await pContext.step('Preserve existing converters when adding new one', () => {
        // Setup.
        const lGraph = Graph.define(() => GraphNode.new<string>())
            .converter((pData) => ({ ...pData, step1: true }));

        // Process.
        const lNewGraph = lGraph.converter((pData) => ({ ...pData, step2: true }));

        // Evaluation.
        const lResult = lNewGraph.convert({ key: 'value' }, generateState(undefined, undefined));
        expect(lResult).toHaveProperty('step1', true);
        expect(lResult).toHaveProperty('step2', true);
    });
});
