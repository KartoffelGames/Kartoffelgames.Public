import { Exception } from '@kartoffelgames/core';
import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { GraphNode, GraphValue } from "../source/graph/graph-node.ts";


describe('graphNode', () => {
    describe('Static Method: new', () => {
        it('-- Anonymous root node', () => {
            // Setup.
            const lAnonymousNode: GraphNode<string> = GraphNode.new<string>();

            // Process.
            const lErrorFunction = () => {
                lAnonymousNode.root;
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(Exception);
        });
    });

    it('Property: root', () => {
        // Setup.
        const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

        // Process.
        const lGraph: GraphNode<string> = lRequiredNode.required('Value');

        // Evaluation.
        expect(lGraph.root).toBe(lRequiredNode);
    });

    it('Property: configuration', () => {
        // Setup.
        const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

        // Process.
        const lGraph: GraphNode<string> = lRequiredNode.required('Name', 'Value');

        // Evaluation.
        expect(lGraph.root).toBe(lRequiredNode);
        expect(lGraph.configuration.isRequired).toBeTruthy();
        expect(lGraph.configuration.isList).toBeFalsy();
        expect(lGraph.configuration.isBranch).toBeFalsy();
        expect(lGraph.configuration.dataKey).toBe('Name');
    });

    describe('Method: mergeData', () => {
        // TODO: 
    });

    describe('Method: next', () => {
        it('-- Required single value, no next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next();

            // Evaluation.
            expect(lValues).toHaveLength(1);
            expect(lValues[0]).toBe('Value');
        });

        it('-- Required single value, existing next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');
            lRequiredNode.required('Value');

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next();

            // Evaluation.
            expect(lValues).toHaveLength(1);
            expect(lValues[0]).toBe('Value');
        });

        it('-- Optional single value, no next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().optional('Value');

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next();

            // Evaluation.
            expect(lValues).toHaveLength(2);
            expect(lValues[0]).toBe('Value');
            expect(lValues[1]).toBeNull();
        });

        it('-- Optional single value, existing next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().optional('Value');
            const lNextNode: GraphNode<string> = lRequiredNode.required('Value');

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next();

            // Evaluation.
            expect(lValues).toHaveLength(2);
            expect(lValues[0]).toBe('Value');
            expect(lValues[1]).toBe(lNextNode);
        });

        it('-- Required single value, no next, forced next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next(true);

            // Evaluation.
            expect(lValues).toHaveLength(1);
            expect(lValues[0]).toBeNull();
        });

        it('-- Required single value, existing next, forced next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');
            const lNextNode: GraphNode<string> = lRequiredNode.required('Value');

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next(true);

            // Evaluation.
            expect(lValues).toHaveLength(1);
            expect(lValues[0]).toBe(lNextNode);
        });

        it('-- Optional single value, no next, forced next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().optional('Value');

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next(true);

            // Evaluation.
            expect(lValues).toHaveLength(1);
            expect(lValues[0]).toBeNull();
        });

        it('-- Optional single value, existing next, forced next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().optional('Value');
            const lNextNode: GraphNode<string> = lRequiredNode.required('Value');

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next(true);

            // Evaluation.
            expect(lValues).toHaveLength(1);
            expect(lValues[0]).toBe(lNextNode);
        });

        it('-- Required branch value, no next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(['Value', 'Value2']);

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next();

            // Evaluation.
            expect(lValues).toHaveLength(2);
            expect(lValues[0]).toBe('Value');
            expect(lValues[1]).toBe('Value2');
        });

        it('-- Required branch value, existing next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(['Value', 'Value2']);
            lRequiredNode.required('Value');

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next();

            // Evaluation.
            expect(lValues).toHaveLength(2);
            expect(lValues[0]).toBe('Value');
            expect(lValues[1]).toBe('Value2');
        });

        it('-- Optional branch value, no next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().optional(['Value', 'Value2']);

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next();

            // Evaluation.
            expect(lValues).toHaveLength(3);
            expect(lValues[0]).toBe('Value');
            expect(lValues[1]).toBe('Value2');
            expect(lValues[2]).toBeNull();
        });

        it('-- Optional branch value, existing next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().optional(['Value', 'Value2']);
            const lNextNode: GraphNode<string> = lRequiredNode.required('Value');

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next();

            // Evaluation.
            expect(lValues).toHaveLength(3);
            expect(lValues[0]).toBe('Value');
            expect(lValues[1]).toBe('Value2');
            expect(lValues[2]).toBe(lNextNode);
        });

        it('-- Required branch value, no next, forced next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(['Value', 'Value2']);

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next(true);

            // Evaluation.
            expect(lValues).toHaveLength(1);
            expect(lValues[0]).toBeNull();
        });

        it('-- Required branch value, existing next, forced next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(['Value', 'Value2']);
            const lNextNode: GraphNode<string> = lRequiredNode.required('Value');

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next(true);

            // Evaluation.
            expect(lValues).toHaveLength(1);
            expect(lValues[0]).toBe(lNextNode);
        });

        it('-- Optional branch value, no next, forced next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().optional(['Value', 'Value2']);

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next(true);

            // Evaluation.
            expect(lValues).toHaveLength(1);
            expect(lValues[0]).toBeNull();
        });

        it('-- Optional branch value, existing next, forced next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().optional(['Value', 'Value2']);
            const lNextNode: GraphNode<string> = lRequiredNode.required('Value');

            // Process.
            const lValues: Array<GraphValue<string> | null> = lRequiredNode.next(true);

            // Evaluation.
            expect(lValues).toHaveLength(1);
            expect(lValues[0]).toBe(lNextNode);
        });
    });

    describe('Method: required', () => {
        it('-- Create linear unnamed', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.required('Value');

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeTruthy();
            expect(lGraph.configuration.isList).toBeFalsy();
            expect(lGraph.configuration.isBranch).toBeFalsy();
            expect(lGraph.configuration.dataKey).toBe('');
        });

        it('-- Create linear named', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.required('Name', 'Value');

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeTruthy();
            expect(lGraph.configuration.isList).toBeFalsy();
            expect(lGraph.configuration.isBranch).toBeFalsy();
            expect(lGraph.configuration.dataKey).toBe('Name');
        });

        it('-- Create linear list', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.required('Name[]', 'Value');

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeTruthy();
            expect(lGraph.configuration.isList).toBeTruthy();
            expect(lGraph.configuration.isBranch).toBeFalsy();
            expect(lGraph.configuration.dataKey).toBe('Name');
        });

        it('-- Create linear merge', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.required('Name<-InnerName',
                GraphNode.new().required('InnerName', 'InnerValue')
            );

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeTruthy();
            expect(lGraph.configuration.isList).toBeTruthy();
            expect(lGraph.configuration.isBranch).toBeFalsy();
            expect(lGraph.configuration.dataKey).toBe('Name');
        });

        it('-- Create branch unnamed', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.required(['Value', 'Value2']);

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeTruthy();
            expect(lGraph.configuration.isList).toBeFalsy();
            expect(lGraph.configuration.isBranch).toBeTruthy();
            expect(lGraph.configuration.dataKey).toBe('');
        });

        it('-- Create branch named', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.required('Name', ['Value', 'Value2']);

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeTruthy();
            expect(lGraph.configuration.isList).toBeFalsy();
            expect(lGraph.configuration.isBranch).toBeTruthy();
            expect(lGraph.configuration.dataKey).toBe('Name');
        });

        it('-- Create branch list', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.required('Name[]', ['Value', 'Value2']);

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeTruthy();
            expect(lGraph.configuration.isList).toBeTruthy();
            expect(lGraph.configuration.isBranch).toBeTruthy();
            expect(lGraph.configuration.dataKey).toBe('Name');
        });

        it('-- Error double chaining', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            lRequiredNode.required('Value');
            const lErrorFunction = () => {
                lRequiredNode.required('Value');
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(Exception);
        });
    });

    describe('Method: optional', () => {
        it('-- Create linear unnamed', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.optional('Value');

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeFalsy();
            expect(lGraph.configuration.isList).toBeFalsy();
            expect(lGraph.configuration.isBranch).toBeFalsy();
            expect(lGraph.configuration.dataKey).toBe('');
        });

        it('-- Create linear named', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.optional('Name', 'Value');

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeFalsy();
            expect(lGraph.configuration.isList).toBeFalsy();
            expect(lGraph.configuration.isBranch).toBeFalsy();
            expect(lGraph.configuration.dataKey).toBe('Name');
        });

        it('-- Create linear list', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.optional('Name[]', 'Value');

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeFalsy();
            expect(lGraph.configuration.isList).toBeTruthy();
            expect(lGraph.configuration.isBranch).toBeFalsy();
            expect(lGraph.configuration.dataKey).toBe('Name');
        });

        it('-- Create linear merge', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.optional('Name<-InnerName',
                GraphNode.new().required('InnerName', 'InnerValue')
            );

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeFalsy();
            expect(lGraph.configuration.isList).toBeTruthy();
            expect(lGraph.configuration.isBranch).toBeFalsy();
            expect(lGraph.configuration.dataKey).toBe('Name');
        });

        it('-- Create branch unnamed', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.optional(['Value', 'Value2']);

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeFalsy();
            expect(lGraph.configuration.isList).toBeFalsy();
            expect(lGraph.configuration.isBranch).toBeTruthy();
            expect(lGraph.configuration.dataKey).toBe('');
        });

        it('-- Create branch named', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.optional('Name', ['Value', 'Value2']);

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeFalsy();
            expect(lGraph.configuration.isList).toBeFalsy();
            expect(lGraph.configuration.isBranch).toBeTruthy();
            expect(lGraph.configuration.dataKey).toBe('Name');
        });

        it('-- Create branch list', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lGraph: GraphNode<string> = lRequiredNode.optional('Name[]', ['Value', 'Value2']);

            // Evaluation.
            expect(lGraph.root).toBe(lRequiredNode);
            expect(lGraph.configuration.isRequired).toBeFalsy();
            expect(lGraph.configuration.isList).toBeTruthy();
            expect(lGraph.configuration.isBranch).toBeTruthy();
            expect(lGraph.configuration.dataKey).toBe('Name');
        });

        it('-- Error double chaining', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            lRequiredNode.optional('Value');
            const lErrorFunction = () => {
                lRequiredNode.optional('Value');
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(Exception);
        });
    });
});