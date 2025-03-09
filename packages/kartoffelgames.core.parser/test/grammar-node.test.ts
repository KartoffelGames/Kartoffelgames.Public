import { Exception } from '@kartoffelgames/core';
import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { GraphNode } from "../source/graph/graph-node.ts";


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