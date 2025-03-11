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
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections;

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
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections;

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
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections;

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
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections;

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
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections;

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
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections;

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
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections;

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
            const lConnections: GraphNodeConnections<string> = lRequiredNode.connections;

            // Evaluation.
            expect(lConnections.required).toBeFalsy();
            expect(lConnections.values).toHaveLength(2);
            expect(lConnections.values[0]).toBe('Value');
            expect(lConnections.values[1]).toBe('Value2');
            expect(lConnections.next).toBe(lNextNode);
        });
    });

    describe('Method: mergeData', () => {
        it('No key, primitive value', () => {
            // Setup.
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12 };
            const lRequiredNode: GraphNode<string> = GraphNode.new().required('sometoken');
            const lValue: any = 'PrimitiveValue';

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
        });

        it('Single key, primitive value', () => {
            // Setup.
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12 };
            const lPrimaryKey: string = 'Value';
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(lPrimaryKey, 'sometoken');
            const lValue: any = 'PrimitiveValue';

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
            expect(lResultData).toHaveProperty(lPrimaryKey);
            expect(lResultData[lPrimaryKey]).toBe(lValue);
        });

        it('Single key, reference value', () => {
            // Setup.
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12 };
            const lPrimaryKey: string = 'Value';
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(lPrimaryKey, 'sometoken');
            const lValue: any = { key: 'something-else' };

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
            expect(lResultData).toHaveProperty(lPrimaryKey);
            expect(lResultData[lPrimaryKey]).toBe(lValue);
        });

        it('Single key with existing key', () => {
            // Setup.
            const lPrimaryKey: string = 'Value';
            const lChainValue: { [key: string]: any; } = { [lPrimaryKey]: 12 };
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(lPrimaryKey, 'sometoken');
            const lValue: any = 'PrimitiveValue';

            // Process.
            const lFailFunction = () => {
                lRequiredNode.mergeData(lValue, lChainValue);
            };

            // Evaluation.
            expect(lFailFunction).toThrow(`Graph path has a dublicate value identifier "${lPrimaryKey}"`);
        });

        it('Array key no merge, primitive value', () => {
            // Setup.
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12 };
            const lPrimaryKey: string = 'Value';
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}[]`, 'sometoken');
            const lValue: any = 'PrimitiveValue';

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
            expect(lResultData).toHaveProperty(lPrimaryKey);
            expect(lResultData[lPrimaryKey]).toHaveLength(1);
            expect(lResultData[lPrimaryKey][0]).toBe(lValue);
        });

        it('Array key no merge, reference value', () => {
            // Setup.
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12 };
            const lPrimaryKey: string = 'Value';
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}[]`, 'sometoken');
            const lValue: any = { key: 'something-else' };

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
            expect(lResultData).toHaveProperty(lPrimaryKey);
            expect(lResultData[lPrimaryKey]).toHaveLength(1);
            expect(lResultData[lPrimaryKey][0]).toBe(lValue);
        });

        it('Array key with merge, primitive value', () => {
            // Setup.
            const lPrimaryKey: string = 'Value';
            const lPreValue: string = 'Prevalue';
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12, [lPrimaryKey]: [lPreValue] };
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}[]`, 'sometoken');
            const lValue: any = 'PrimitiveValue';

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
            expect(lResultData).toHaveProperty(lPrimaryKey);
            expect(lResultData[lPrimaryKey]).toHaveLength(2);
            expect(lResultData[lPrimaryKey][0]).toBe(lValue);
            expect(lResultData[lPrimaryKey][1]).toBe(lPreValue);
        });

        it('Array key with merge, array value', () => {
            // Setup.
            const lPrimaryKey: string = 'Value';
            const lPreValue: string = 'Prevalue';
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12, [lPrimaryKey]: [lPreValue] };
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}[]`, 'sometoken');
            const lValue: any = ['PrimitiveValue1', 'PrimitiveValue2'];

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
            expect(lResultData).toHaveProperty(lPrimaryKey);
            expect(lResultData[lPrimaryKey]).toHaveLength(3);
            expect(lResultData[lPrimaryKey][0]).toBe(lValue[0]);
            expect(lResultData[lPrimaryKey][1]).toBe(lValue[1]);
            expect(lResultData[lPrimaryKey][2]).toBe(lPreValue);
        });

        it('Array key with merge, reference value', () => {
            // Setup.
            const lPrimaryKey: string = 'Value';
            const lPreValue: string = 'Prevalue';
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12, [lPrimaryKey]: [lPreValue] };
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}[]`, 'sometoken');
            const lValue: any = { key: 'something-else' };

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
            expect(lResultData).toHaveProperty(lPrimaryKey);
            expect(lResultData[lPrimaryKey]).toHaveLength(2);
            expect(lResultData[lPrimaryKey][0]).toBe(lValue);
            expect(lResultData[lPrimaryKey][1]).toBe(lPreValue);
        });

        it('Merge key existing key not array.', () => {
            // Setup.
            const lPrimaryKey: string = 'Value';
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12, [lPrimaryKey]: 'NOT_AN_ARRAY' };
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}[]`, 'sometoken');

            // Process.
            const lFailFunction = () => {
                lRequiredNode.mergeData('PrimitiveValue', lChainValue);
            };

            // Evaluation.
            expect(lFailFunction).toThrow(`Chain data merge value is not an array but should be.`);
        });

        it('Merge key no merge, primitive value', () => {
            // Setup keys.
            const lPrimaryKey: string = 'Value';
            const lMergeKey: string = 'MergeKey';

            // Setup values.
            const lValue: string = 'PrimitiveValue';
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12 };
            const lNodeValue: any = { [lMergeKey]: lValue };

            // Setup graph.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}<-${lMergeKey}`, GraphNode.new().required(lMergeKey, 'sometoken'));

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lNodeValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
            expect(lResultData).toHaveProperty(lPrimaryKey);
            expect(lResultData[lPrimaryKey]).toHaveLength(1);
            expect(lResultData[lPrimaryKey][0]).toBe(lValue);
        });

        it('Merge key no merge, reference value', () => {
            // Setup keys.
            const lPrimaryKey: string = 'Value';
            const lMergeKey: string = 'MergeKey';

            // Setup values.
            const lValue: any = { key: 'something-else' };
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12 };
            const lNodeValue: any = { [lMergeKey]: lValue };

            // Setup graph.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}<-${lMergeKey}`, GraphNode.new().required(lMergeKey, 'sometoken'));

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lNodeValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
            expect(lResultData).toHaveProperty(lPrimaryKey);
            expect(lResultData[lPrimaryKey]).toHaveLength(1);
            expect(lResultData[lPrimaryKey][0]).toBe(lValue);
        });

        it('Merge key with merge, primitive value', () => {
            // Setup keys.
            const lPrimaryKey: string = 'Value';
            const lMergeKey: string = 'MergeKey';

            // Setup values.
            const lPreValue: string = 'Prevalue';
            const lValue: any = 'PrimitiveValue';
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12, [lPrimaryKey]: [lPreValue] };
            const lNodeValue: any = { [lMergeKey]: lValue };

            // Setup graph.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}<-${lMergeKey}`, GraphNode.new().required(lMergeKey, 'sometoken'));

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lNodeValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
            expect(lResultData).toHaveProperty(lPrimaryKey);
            expect(lResultData[lPrimaryKey]).toHaveLength(2);
            expect(lResultData[lPrimaryKey][0]).toBe(lValue);
            expect(lResultData[lPrimaryKey][1]).toBe(lPreValue);
        });

        it('Merge key with merge, reference value', () => {
            // Setup keys.
            const lPrimaryKey: string = 'Value';
            const lMergeKey: string = 'MergeKey';

            // Setup values.
            const lPreValue: any = { somekey: 'somevalue' };
            const lValue: any = { key: 'something-else' };
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12, [lPrimaryKey]: [lPreValue] };
            const lNodeValue: any = { [lMergeKey]: lValue };

            // Setup graph.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}<-${lMergeKey}`, GraphNode.new().required(lMergeKey, 'sometoken'));

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lNodeValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
            expect(lResultData).toHaveProperty(lPrimaryKey);
            expect(lResultData[lPrimaryKey]).toHaveLength(2);
            expect(lResultData[lPrimaryKey][0]).toBe(lValue);
            expect(lResultData[lPrimaryKey][1]).toBe(lPreValue);
        });

        it('Merge key with merge, array value', () => {
            // Setup keys.
            const lPrimaryKey: string = 'Value';
            const lMergeKey: string = 'MergeKey';

            // Setup values.
            const lPreValue: any = { somekey: 'somevalue' };
            const lValue: any = ['PrimitiveValue1', 'PrimitiveValue2'];
            const lChainValue: { [key: string]: any, pre: number; } = { pre: 12, [lPrimaryKey]: [lPreValue] };
            const lNodeValue: any = { [lMergeKey]: lValue };

            // Setup graph.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}<-${lMergeKey}`, GraphNode.new().required(lMergeKey, 'sometoken'));

            // Process.
            const lResultData: any = lRequiredNode.mergeData(lNodeValue, lChainValue);

            // Evaluation.
            expect(lResultData).toHaveProperty('pre');
            expect(lResultData.pre).toBe(lChainValue.pre);
            expect(lResultData).toHaveProperty(lPrimaryKey);
            expect(lResultData[lPrimaryKey]).toHaveLength(3);
            expect(lResultData[lPrimaryKey][0]).toBe(lValue[0]);
            expect(lResultData[lPrimaryKey][1]).toBe(lValue[1]);
            expect(lResultData[lPrimaryKey][2]).toBe(lPreValue);
        });

        it('Merge key no object as node data', () => {
            // Setup keys.
            const lPrimaryKey: string = 'Value';
            const lMergeKey: string = 'MergeKey';

            // Setup values.
            const lChainValue: { [key: string]: any; } = {};
            const lNodeValue: any = 'Wrong value';

            // Setup graph.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}<-${lMergeKey}`, GraphNode.new().required(lMergeKey, 'sometoken'));

            // Process.
            const lFailFunction = () => {
                lRequiredNode.mergeData(lNodeValue, lChainValue);
            };

            // Evaluation.
            expect(lFailFunction).toThrow('Node data must be an object when merge key is set.');
        });

        it('Merge key node object missing key.', () => {
            // Setup keys.
            const lPrimaryKey: string = 'Value';
            const lMergeKey: string = 'MergeKey';

            // Setup values.
            const lChainValue: { [key: string]: any; } = {};
            const lNodeValue: any = { 'WrongKey': 'PrimitiveValue' };

            // Setup graph.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}<-${lMergeKey}`, GraphNode.new().required(lMergeKey, 'sometoken'));

            // Process.
            const lFailFunction = () => {
                lRequiredNode.mergeData(lNodeValue, lChainValue);
            };

            // Evaluation.
            expect(lFailFunction).toThrow(`Node data does not contain merge key "${lMergeKey}"`);
        });

        it('Merge key existing key not array.', () => {
            // Setup keys.
            const lPrimaryKey: string = 'Value';
            const lMergeKey: string = 'MergeKey';

            // Setup values.
            const lChainValue: { [key: string]: any; } = { [lPrimaryKey]: 'NOT_AN_ARRAY' };
            const lNodeValue: any = { [lMergeKey]: { key: 'something-else' } };

            // Setup graph.
            const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}<-${lMergeKey}`, GraphNode.new().required(lMergeKey, 'sometoken'));

            // Process.
            const lFailFunction = () => {
                lRequiredNode.mergeData(lNodeValue, lChainValue);
            };

            // Evaluation.
            expect(lFailFunction).toThrow(`Chain data merge value is not an array but should be.`);
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