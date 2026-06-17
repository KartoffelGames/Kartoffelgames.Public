import { expect } from '@kartoffelgames/core-test';
import { PotatnoStaticNodeDefinition } from '../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoImportDefinition } from '../../source/project/potatno-import-definition.ts';
import type { PotatnoTestProjectTypesDefinition } from '../helper/potatno_test_project/potatno-test-project-types-definition.ts';

Deno.test('new PotatnoImportDefinition()', async (pContext) => {
    await pContext.step('Construct with id and label', () => {
        // Setup. Process.
        const lImport = new PotatnoImportDefinition<PotatnoTestProjectTypesDefinition>('TestImport', 'Test Import');

        // Evaluation.
        expect(lImport.id).toBe('TestImport');
        expect(lImport.label).toBe('Test Import');
        expect(lImport.nodes.length).toBe(0);
    });
});

Deno.test('PotatnoImportDefinition.addNode()', async (pContext) => {
    await pContext.step('Adds node definitions in call order', () => {
        // Setup.
        const lImport = new PotatnoImportDefinition<PotatnoTestProjectTypesDefinition>('TestImport', 'Test Import');
        const lNodeOne = new PotatnoStaticNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'NodeOne',
            label: 'Node One',
            category: 'test',
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });
        const lNodeTwo = new PotatnoStaticNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'NodeTwo',
            label: 'Node Two',
            category: 'test',
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });

        // Process.
        lImport.addNode(lNodeOne);
        lImport.addNode(lNodeTwo);

        // Evaluation.
        expect(lImport.nodes.length).toBe(2);
        expect(lImport.nodes[0]).toBe(lNodeOne);
        expect(lImport.nodes[1]).toBe(lNodeTwo);
    });
});
