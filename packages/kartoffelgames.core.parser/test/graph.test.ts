import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { Graph } from '../source/parser/graph/graph.ts';
import { GraphNode } from '../source/parser/graph/graph-node.ts';

describe('Graph', () => {
    describe('Static Method: define', () => {
        it('should create a new Graph instance with the provided node collector', () => {
            // Setup.
            const lNodeCollector = () => GraphNode.new<string>().required('key', 'value');

            // Process.
            const lGraph = Graph.define(lNodeCollector);

            // Evaluation.
            expect(lGraph).toBeInstanceOf(Graph as any);
            expect(lGraph.node).toBeInstanceOf(GraphNode as any);
        });
    });

    describe('Property: node', () => {
        it('should resolve and return the root node of the graph', () => {
            // Setup.
            const lNodeCollector = () => GraphNode.new<string>().required('key', 'value');
            const lGraph = Graph.define(lNodeCollector);

            // Process.
            const lNode = lGraph.node;

            // Evaluation.
            expect(lNode).toBeInstanceOf(GraphNode as any);
            expect(lNode.configuration.dataKey).toBe('key');
        });

        it('should cache the resolved root node', () => {
            // Setup.
            let callCount = 0;
            const lNodeCollector = () => {
                callCount++;
                return GraphNode.new<string>().required('key', 'value');
            };
            const lGraph = Graph.define(lNodeCollector);

            // Process.
            const lFirstNode = lGraph.node;
            const lSecondNode = lGraph.node;

            // Evaluation.
            expect(callCount).toBe(1);
            expect(lFirstNode).toBe(lSecondNode);
        });
    });

    describe('Method: convert', () => {
        it('should return raw data if no converters are added', () => {
            // Setup.
            const lGraph = Graph.define(() => GraphNode.new<string>());
            const lRawData = { key: 'value' };

            // Process.
            const lResult = lGraph.convert(lRawData);

            // Evaluation.
            expect(lResult).toBe(lRawData);
        });

        it('should apply a single converter to the raw data', () => {
            // Setup.
            const lGraph = Graph.define(() => GraphNode.new<string>())
                .converter((pData) => ({ ...pData, extra: 'added' }));
            const lRawData = { key: 'value' };

            // Process.
            const lResult = lGraph.convert(lRawData);

            // Evaluation.
            expect(lResult).toHaveProperty('key', 'value');
            expect(lResult).toHaveProperty('extra', 'added');
        });

        it('should apply multiple converters in sequence', () => {
            // Setup.
            const lGraph = Graph.define(() => GraphNode.new<string>())
                .converter((pData) => ({ ...pData, step1: true }))
                .converter((pData) => ({ ...pData, step2: true }));
            const lRawData = { key: 'value' };

            // Process.
            const lResult = lGraph.convert(lRawData);

            // Evaluation.
            expect(lResult).toHaveProperty('key', 'value');
            expect(lResult).toHaveProperty('step1', true);
            expect(lResult).toHaveProperty('step2', true);
        });

        it('should stop processing converters if a symbol is returned', () => {
            // Setup.
            const lGraph = Graph.define(() => GraphNode.new<string>())
                .converter(() => Symbol('error'))
                .converter(() => ({ key: 'value' }));
            const lRawData = { key: 'value' };

            // Process.
            const lResult = lGraph.convert(lRawData);

            // Evaluation.
            expect(typeof lResult).toBe('symbol');
        });
    });

    describe('Method: converter', () => {
        it('should add a new data converter to the graph', () => {
            // Setup.
            const lGraph = Graph.define(() => GraphNode.new<string>());

            // Process.
            const lNewGraph = lGraph.converter((pData) => ({ ...pData, extra: 'added' }));

            // Evaluation.
            expect(lNewGraph).not.toBe(lGraph);
            expect(lNewGraph.convert({ key: 'value' })).toHaveProperty('extra', 'added');
        });

        it('should preserve existing converters when adding a new one', () => {
            // Setup.
            const lGraph = Graph.define(() => GraphNode.new<string>())
                .converter((pData) => ({ ...pData, step1: true }));

            // Process.
            const lNewGraph = lGraph.converter((pData) => ({ ...pData, step2: true }));

            // Evaluation.
            const lResult = lNewGraph.convert({ key: 'value' });
            expect(lResult).toHaveProperty('step1', true);
            expect(lResult).toHaveProperty('step2', true);
        });
    });
});
