import { Exception } from '@kartoffelgames/core';
import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { GraphNode, GraphNodeConnections, GraphValue } from "../source/graph/graph-node.ts";


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

    describe('Property: configuration', () => {
        it('-- Required single value, no next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

            // Process.
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections

            // Evaluation.
            expect(lConnections.required).toBeTruthy();
            expect(lConnections.values).toHaveLength(1);
            expect(lConnections.values[0]).toBe('Value');
            expect(lConnections.next).toBeNull();
        });

        it('-- Required single value, existing next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');
            const lNextNode: GraphNode<string> = lRequiredNode.required('Value');

            // Process.
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections

            // Evaluation.
            expect(lConnections.required).toBeTruthy();
            expect(lConnections.values).toHaveLength(1);
            expect(lConnections.values[0]).toBe('Value');
            expect(lConnections.next).toBe(lNextNode);
        });

        it('-- Optional single value, no next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().optional('Value');

            // Process.
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections

            // Evaluation.
            expect(lConnections.required).toBeFalsy();
            expect(lConnections.values).toHaveLength(1);
            expect(lConnections.values[0]).toBe('Value');
            expect(lConnections.next).toBeNull();
        });

        it('-- Optional single value, existing next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().optional('Value');
            const lNextNode: GraphNode<string> = lRequiredNode.required('Value');

            // Process.
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections

            // Evaluation.
            expect(lConnections.required).toBeFalsy();
            expect(lConnections.values).toHaveLength(1);
            expect(lConnections.values[0]).toBe('Value');
            expect(lConnections.next).toBe(lNextNode);
        });

        it('-- Required branch value, no next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(['Value', 'Value2']);

            // Process.
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections

            // Evaluation.
            expect(lConnections.required).toBeTruthy();
            expect(lConnections.values).toHaveLength(2);
            expect(lConnections.values[0]).toBe('Value');
            expect(lConnections.values[1]).toBe('Value2');
            expect(lConnections.next).toBeNull();
        });

        it('-- Required branch value, existing next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(['Value', 'Value2']);
            const lNextNode: GraphNode<string> = lRequiredNode.required('Value');
            // Process.
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections

            // Evaluation.
            expect(lConnections.required).toBeTruthy();
            expect(lConnections.values).toHaveLength(2);
            expect(lConnections.values[0]).toBe('Value');
            expect(lConnections.values[1]).toBe('Value2');
            expect(lConnections.next).toBe(lNextNode);
        });

        it('-- Optional branch value, no next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().optional(['Value', 'Value2']);

            // Process.
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections

            // Evaluation.
            expect(lConnections.required).toBeFalsy();
            expect(lConnections.values).toHaveLength(2);
            expect(lConnections.values[0]).toBe('Value');
            expect(lConnections.values[1]).toBe('Value2');
            expect(lConnections.next).toBeNull();
        });

        it('-- Optional branch value, existing next', () => {
            // Setup.
            const lRequiredNode: GraphNode<string> = GraphNode.new().optional(['Value', 'Value2']);
            const lNextNode: GraphNode<string> = lRequiredNode.required('Value');

            // Process.
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections

            // Evaluation.
            expect(lConnections.required).toBeFalsy();
            expect(lConnections.values).toHaveLength(2);
            expect(lConnections.values[0]).toBe('Value');
            expect(lConnections.values[1]).toBe('Value2');
            expect(lConnections.next).toBe(lNextNode);
        });
    });

    describe('Method: mergeData', () => {
        // TODO: 
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