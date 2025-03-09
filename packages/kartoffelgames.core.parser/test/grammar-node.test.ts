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

    describe('Functionality: Chainging', () => {
        it('-- Create with chaining required unnamed', () => {
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

        it('-- Create with chaining optional unnamed', () => {
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

        it('-- Create with chaining branch unnamed', () => {
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

        it('-- Create with chaining optional branch unnamed', () => {
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

        it('-- Create with chaining required named', () => {
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

        it('-- Create with chaining optional named', () => {
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

        it('-- Create with chaining branch named', () => {
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

        it('-- Create with chaining optional branch named', () => {
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

        it('-- Create with chaining required named list', () => {
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

        it('-- Create with chaining optional named list', () => {
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

        it('-- Create with chaining branch named list', () => {
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

        it('-- Create with chaining optional branch named list', () => {
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

        it('-- Create with chaining required named merge', () => {
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

        it('-- Create with chaining optional named merge', () => {
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

        it('-- Error on Node double chaining', () => {
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
});