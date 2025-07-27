import { Exception } from '@kartoffelgames/core';
import { expect } from '@kartoffelgames/core-test';
import { GraphNode, type GraphNodeConnections } from '../source/parser/graph/graph-node.ts';

Deno.test('GraphNode.new()', async (pContext) => {
    await pContext.step('Anonymous root node', () => {
        // Setup.
        const lAnonymousNode: GraphNode<string> = GraphNode.new<string>();

        // Process.
        const lErrorFunction = () => {
            const _ = lAnonymousNode.root;
        };

        // Evaluation.
        expect(lErrorFunction).toThrow(Exception);
    });
});

Deno.test('GraphNode.root', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

        // Process.
        const lGraph: GraphNode<string> = lRequiredNode.required('Value');

        // Evaluation.
        expect(lGraph.root).toBe(lRequiredNode);
    });
});

Deno.test('GraphNode.configuration', async (pContext) => {
    await pContext.step('Default', () => {
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

    await pContext.step('Required single value, no next', () => {
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

    await pContext.step('Required single value, existing next', () => {
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

    await pContext.step('Optional single value, no next', () => {
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

    await pContext.step('Optional single value, existing next', () => {
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

    await pContext.step('Required branch value, no next', () => {
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

    await pContext.step('Required branch value, existing next', () => {
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

    await pContext.step('Optional branch value, no next', () => {
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

    await pContext.step('Optional branch value, existing next', () => {
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

Deno.test('GraphNode.mergeData()', async (pContext) => {
    await pContext.step('No key, primitive value', () => {
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

    await pContext.step('Single key, primitive value', () => {
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

    await pContext.step('Single key, reference value', () => {
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

    await pContext.step('Single key with existing key', () => {
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
        expect(lFailFunction).toThrow(`Graph path has a duplicate value identifier "${lPrimaryKey}"`);
    });

    await pContext.step('Array key no merge, primitive value', () => {
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

    await pContext.step('Array key no merge, reference value', () => {
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

    await pContext.step('Array key with merge, primitive value', () => {
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

    await pContext.step('Array key with merge, array value', () => {
        // Setup.
        const lPrimaryKey: string = 'Value';
        const lValueList: Array<string> = ['PrimitiveValue1', 'PrimitiveValue2', 'PrimitiveValue3'];
        const lChainValue: { [key: string]: any, pre: number; } = { pre: 12, [lPrimaryKey]: [lValueList[2]] };
        const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}[]`, 'sometoken');
        
        // Process.
        const lResultData: any = lRequiredNode.mergeData(lValueList.slice(0,2), lChainValue);

        // Evaluation.
        expect(lResultData).toHaveProperty('pre');
        expect(lResultData.pre).toBe(lChainValue.pre);
        expect(lResultData).toHaveProperty(lPrimaryKey);
        expect(lResultData[lPrimaryKey]).toHaveLength(lValueList.length);
        expect(lResultData[lPrimaryKey]).toEqual(lValueList);
    });

    await pContext.step('Array key with merge, reference value', () => {
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

    await pContext.step('Merge key existing key not array.', () => {
        // Setup.
        const lPrimaryKey: string = 'Value';
        const lPossibleResultValue: Array<string> = ['PrimitiveValue', 'NOT_AN_ARRAY'];
        const lChainValue: { [key: string]: any, pre: number; } = { pre: 12, [lPrimaryKey]: lPossibleResultValue[1] };
        const lRequiredNode: GraphNode<string> = GraphNode.new().required(`${lPrimaryKey}[]`, 'sometoken');

        // Process.
        const lData = lRequiredNode.mergeData(lPossibleResultValue[0], lChainValue);

        // Evaluation.
        expect(lData).toEqual({
            pre: 12,
            [lPrimaryKey]: lPossibleResultValue
        });
    });

    await pContext.step('Merge key no merge, primitive value', () => {
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
        expect(lResultData[lPrimaryKey]).toBe(lValue);
    });

    await pContext.step('Merge key no merge, reference value', () => {
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
        expect(lResultData[lPrimaryKey]).toBe(lValue);
    });

    await pContext.step('Merge key with merge, primitive value', () => {
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

    await pContext.step('Merge key with merge, reference value', () => {
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

    await pContext.step('Merge key with merge, array value', () => {
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

    await pContext.step('Merge key no object as node data', () => {
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

    await pContext.step('Merge key node object missing key - required.', () => {
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

    await pContext.step('Merge key node object missing key - optional.', () => {
        // Setup keys.
        const lPrimaryKey: string = 'Value';
        const lMergeKey: string = 'MergeKey';

        // Setup values.
        const lChainValue: { [key: string]: any; } = {};
        const lNodeValue: any = { 'WrongKey': 'PrimitiveValue' };

        // Setup graph.
        const lRequiredNode: GraphNode<string> = GraphNode.new().optional(`${lPrimaryKey}<-${lMergeKey}`, GraphNode.new().required(lMergeKey, 'sometoken'));

        // Process.
        const lFailFunction = () => {
            lRequiredNode.mergeData(lNodeValue, lChainValue);
        };

        // Evaluation.
        expect(lFailFunction).toThrow(`Node data does not contain merge key "${lMergeKey}"`);
    });

    await pContext.step('Merge key existing key not array.', () => {
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

Deno.test('GraphNode.required()', async (pContext) => {
    await pContext.step('Create linear unnamed', () => {
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

    await pContext.step('Create linear named', () => {
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

    await pContext.step('Create linear list', () => {
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

    await pContext.step('Create linear merge', () => {
        // Setup.
        const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

        // Process.
        const lGraph: GraphNode<string> = lRequiredNode.required('Name<-InnerName',
            GraphNode.new().required('InnerName', 'InnerValue')
        );

        // Evaluation.
        expect(lGraph.root).toBe(lRequiredNode);
        expect(lGraph.configuration.isRequired).toBeTruthy();
        expect(lGraph.configuration.isList).toBeFalsy();
        expect(lGraph.configuration.isBranch).toBeFalsy();
        expect(lGraph.configuration.dataKey).toBe('Name');
    });

    await pContext.step('Create branch unnamed', () => {
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

    await pContext.step('Create branch named', () => {
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

    await pContext.step('Create branch list', () => {
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

    await pContext.step('Error double chaining', () => {
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

Deno.test('GraphNode.optional()', async (pContext) => {
    await pContext.step('Create linear unnamed', () => {
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

    await pContext.step('Create linear named', () => {
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

    await pContext.step('Create linear list', () => {
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

    await pContext.step('Create linear merge', () => {
        // Setup.
        const lRequiredNode: GraphNode<string> = GraphNode.new().required('Value');

        // Process.
        const lGraph: GraphNode<string> = lRequiredNode.optional('Name<-InnerName',
            GraphNode.new().required('InnerName', 'InnerValue')
        );

        // Evaluation.
        expect(lGraph.root).toBe(lRequiredNode);
        expect(lGraph.configuration.isRequired).toBeFalsy();
        expect(lGraph.configuration.isList).toBeFalsy();
        expect(lGraph.configuration.isBranch).toBeFalsy();
        expect(lGraph.configuration.dataKey).toBe('Name');
    });

    await pContext.step('Create branch unnamed', () => {
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

    await pContext.step('Create branch named', () => {
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

    await pContext.step('Create branch list', () => {
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

    await pContext.step('Error double chaining', () => {
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