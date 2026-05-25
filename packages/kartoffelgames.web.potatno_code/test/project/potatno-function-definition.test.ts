import { expect } from '@kartoffelgames/core-test';
import { PotatnoStaticNodeDefinition } from '../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from '../../source/project/potatno-function-definition.ts';
import { PotatnoProjectTypesDefinition } from '../../source/project/potatno-project-types-definition.ts';

const lTypes = PotatnoProjectTypesDefinition.new({
    number: {
        default: { string: ['0'], value: 0 },
        convert: (pValues: Array<string>): string => pValues[0],
        inputs: [{ name: 'value', type: 'number' }]
    }
});

const lEmptyGenerator = {
    code: { body: (): string => '', value: (): string => '' }
};

Deno.test('PotatnoFunctionDefinition.new()', async (pContext) => {
    await pContext.step('Construct with no statics flags', () => {
        // Setup. Process.
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'a', label: 'a',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: lEmptyGenerator
        });

        // Evaluation.
        expect(lFunction).toBeDefined();
        expect(lFunction.statics).toBe(0);
    });

    await pContext.step('Construct with combined statics flags', () => {
        // Setup.
        const lCombined: number = PotatnoFunctionDefinitionStatics.imports | PotatnoFunctionDefinitionStatics.inputs;

        // Process.
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'a', label: 'a',
            statics: lCombined, nodes: {},
            generator: lEmptyGenerator
        });

        // Evaluation.
        expect(lFunction.statics).toBe(lCombined);
    });

    await pContext.step('Construct stores id and label', () => {
        // Setup. Process.
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'myId', label: 'myLabel',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: lEmptyGenerator
        });

        // Evaluation.
        expect(lFunction.id).toBe('myId');
        expect(lFunction.label).toBe('myLabel');
    });
});

Deno.test('PotatnoFunctionDefinition.id', async (pContext) => {
    await pContext.step('Returns the provided id', () => {
        // Setup.
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'fancyId', label: 'l',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: lEmptyGenerator
        });

        // Process.
        const lResult: string = lFunction.id;

        // Evaluation.
        expect(lResult).toBe('fancyId');
    });
});

Deno.test('PotatnoFunctionDefinition.label', async (pContext) => {
    await pContext.step('Returns the provided label', () => {
        // Setup.
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'i', label: 'fancyLabel',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: lEmptyGenerator
        });

        // Process.
        const lResult: string = lFunction.label;

        // Evaluation.
        expect(lResult).toBe('fancyLabel');
    });
});

Deno.test('PotatnoFunctionDefinition.statics', async (pContext) => {
    await pContext.step('Returns the raw statics bitmask', () => {
        // Setup.
        const lMask: number = PotatnoFunctionDefinitionStatics.imports
            | PotatnoFunctionDefinitionStatics.inputs
            | PotatnoFunctionDefinitionStatics.outputs;
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'a', label: 'a',
            statics: lMask, nodes: {},
            generator: lEmptyGenerator
        });

        // Process.
        const lResult: number = lFunction.statics;

        // Evaluation.
        expect(lResult).toBe(lMask);
    });

    await pContext.step('Returns zero for none flag', () => {
        // Setup.
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'a', label: 'a',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: lEmptyGenerator
        });

        // Process.
        const lResult: number = lFunction.statics;

        // Evaluation.
        expect(lResult).toBe(0);
    });
});

Deno.test('PotatnoFunctionDefinition.codeGenerator', async (pContext) => {
    await pContext.step('Returns the provided generator object with body and value callbacks', () => {
        // Setup.
        const lGenerator = {
            code: {
                body: (): string => 'body',
                value: (): string => 'value'
            }
        };
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'a', label: 'a',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: lGenerator
        });

        // Process.
        const lResult = lFunction.codeGenerator;

        // Evaluation.
        expect(lResult).toBe(lGenerator.code);
    });
});

Deno.test('PotatnoFunctionDefinition.getNodeDefinitions()', async (pContext) => {
    await pContext.step('Returns empty arrays when no providers are configured', () => {
        // Setup.
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'a', label: 'a',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: lEmptyGenerator
        });

        // Process.
        const lNodes = lFunction.getNodeDefinitions(null as any);

        // Evaluation.
        expect(lNodes.entry.length).toBe(0);
        expect(lNodes.exit.length).toBe(0);
        expect(lNodes.dynamic.length).toBe(0);
    });

    await pContext.step('Entry callback nodes are returned via .entry', () => {
        // Setup.
        const lEntryNode = PotatnoStaticNodeDefinition.newStaticNode({
            id: 'EntryNode', label: 'EntryNode', category: 'event',
            ports: { inputs: [], outputs: [] }, generators: { code: (): string => '' }
        });
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'a', label: 'a',
            statics: PotatnoFunctionDefinitionStatics.none,
            nodes: {
                entry: (pAddNode): void => { pAddNode(lEntryNode); }
            },
            generator: lEmptyGenerator
        });

        // Process.
        const lNodes = lFunction.getNodeDefinitions(null as any);

        // Evaluation.
        expect(lNodes.entry.length).toBe(1);
        expect(lNodes.entry[0]).toBe(lEntryNode);
    });

    await pContext.step('Exit callback nodes are returned via .exit', () => {
        // Setup.
        const lExitNode = PotatnoStaticNodeDefinition.newStaticNode({
            id: 'ExitNode', label: 'ExitNode', category: 'output',
            ports: { inputs: [], outputs: [] }, generators: { code: (): string => '' }
        });
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'a', label: 'a',
            statics: PotatnoFunctionDefinitionStatics.none,
            nodes: {
                exit: (pAddNode): void => { pAddNode(lExitNode); }
            },
            generator: lEmptyGenerator
        });

        // Process.
        const lNodes = lFunction.getNodeDefinitions(null as any);

        // Evaluation.
        expect(lNodes.exit.length).toBe(1);
        expect(lNodes.exit[0]).toBe(lExitNode);
    });

    await pContext.step('Dynamic callback nodes are returned via .dynamic', () => {
        // Setup.
        const lDynamicNode = PotatnoStaticNodeDefinition.newStaticNode({
            id: 'DynamicNode', label: 'DynamicNode', category: 'operator',
            ports: { inputs: [], outputs: [] }, generators: { code: (): string => '' }
        });
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'a', label: 'a',
            statics: PotatnoFunctionDefinitionStatics.none,
            nodes: {
                dynamic: (pAddNode): void => { pAddNode(lDynamicNode); }
            },
            generator: lEmptyGenerator
        });

        // Process.
        const lNodes = lFunction.getNodeDefinitions(null as any);

        // Evaluation.
        expect(lNodes.dynamic.length).toBe(1);
        expect(lNodes.dynamic[0]).toBe(lDynamicNode);
    });

    await pContext.step('Each property re-invokes the provider on access', () => {
        // Setup.
        let lCallCount: number = 0;
        const lFunction = PotatnoFunctionDefinition.new(lTypes, {
            id: 'a', label: 'a',
            statics: PotatnoFunctionDefinitionStatics.none,
            nodes: {
                entry: (): void => { lCallCount++; }
            },
            generator: lEmptyGenerator
        });

        // Process.
        const lNodes = lFunction.getNodeDefinitions(null as any);
        // Access twice.
        const _first = lNodes.entry;
        const _second = lNodes.entry;

        // Evaluation. Provider runs once per access.
        expect(lCallCount).toBe(2);
    });
});

Deno.test('PotatnoFunctionDefinitionStatics', async (pContext) => {
    await pContext.step('none is 0', () => {
        // Setup. Process.
        const lValue: number = PotatnoFunctionDefinitionStatics.none;

        // Evaluation.
        expect(lValue).toBe(0);
    });

    await pContext.step('imports is 1', () => {
        // Setup. Process.
        const lValue: number = PotatnoFunctionDefinitionStatics.imports;

        // Evaluation.
        expect(lValue).toBe(1);
    });

    await pContext.step('inputs is 2', () => {
        // Setup. Process.
        const lValue: number = PotatnoFunctionDefinitionStatics.inputs;

        // Evaluation.
        expect(lValue).toBe(2);
    });

    await pContext.step('outputs is 4', () => {
        // Setup. Process.
        const lValue: number = PotatnoFunctionDefinitionStatics.outputs;

        // Evaluation.
        expect(lValue).toBe(4);
    });
});
