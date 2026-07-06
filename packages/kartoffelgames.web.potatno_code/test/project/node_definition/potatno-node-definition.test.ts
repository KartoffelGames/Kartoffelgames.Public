import { expect } from '@kartoffelgames/core-test';
import { PotatnoNodeDefinition, type PotatnoNodeDefinitionGeneratorContext } from '../../../source/project/node_definition/potatno-node-definition.ts';
import type { PotatnoTestProjectTypesDefinition } from '../../helper/potatno_test_project/potatno-test-project-types-definition.ts';

Deno.test('new PotatnoNodeDefinition()', async (pContext) => {
    await pContext.step('Constructs with provided values', () => {
        // Setup. Process.
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Test Node',
            category: { name: 'TestCategory' },
            regions: { add: ['RegionAdd'], allows: ['RegionAllowed'], requires: ['RegionRequired'] },
            generators: {
                ports: {
                    inputs: (pAddPort): void => {
                        pAddPort({ id: 'inputValue', label: 'Input Value', portType: 'value', dataType: 'number' });
                    },
                    outputs: (pAddPort): void => {
                        pAddPort({ id: 'outputValue', label: 'Output Value', portType: 'value', dataType: 'number' });
                    }
                },
                code: (): string => 'TestCode'
            }
        });

        // Evaluation.
        expect(lDefinition.id).toBe('TestNode');
        expect(lDefinition.label).toBe('Test Node');
        expect(lDefinition.category).toBe('TestCategory');
        expect(lDefinition.regions.add).toEqual(['RegionAdd']);
        expect(lDefinition.regions.allows).toEqual(['RegionAllowed']);
        expect(lDefinition.regions.requires).toEqual(['RegionRequired']);
    });

    await pContext.step('Defaults missing regions to empty arrays', () => {
        // Setup. Process.
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Test Node',
            category: { name: 'TestCategory' },
            generators: {
                ports: {
                    inputs: (): void => { },
                    outputs: (): void => { }
                },
                code: (): string => ''
            }
        });

        // Evaluation.
        expect(lDefinition.regions.add).toEqual([]);
        expect(lDefinition.regions.allows).toEqual([]);
        expect(lDefinition.regions.requires).toEqual([]);
    });
});

Deno.test('PotatnoNodeDefinition.id', async (pContext) => {
    await pContext.step('Returns provided id', () => {
        // Setup.
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'ProvidedId',
            label: 'Test Node',
            category: { name: 'TestCategory' },
            generators: {
                ports: {
                    inputs: (): void => { },
                    outputs: (): void => { }
                },
                code: (): string => ''
            }
        });

        // Process.
        const lResult: string = lDefinition.id;

        // Evaluation.
        expect(lResult).toBe('ProvidedId');
    });
});

Deno.test('PotatnoNodeDefinition.category', async (pContext) => {
    await pContext.step('Returns provided category', () => {
        // Setup.
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Test Node',
            category: { name: 'ProvidedCategory' },
            generators: {
                ports: {
                    inputs: (): void => { },
                    outputs: (): void => { }
                },
                code: (): string => ''
            }
        });

        // Process.
        const lResult: string = lDefinition.category.name;

        // Evaluation.
        expect(lResult).toBe('ProvidedCategory');
    });
});

Deno.test('PotatnoNodeDefinition.inputs', async (pContext) => {
    await pContext.step('Returns generated input definitions', () => {
        // Setup.
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Test Node',
            category: { name: 'TestCategory' },
            generators: {
                ports: {
                    inputs: (pAddPort): void => {
                        pAddPort({ id: 'exec', label: 'Exec', portType: 'flow' });
                        pAddPort({ id: 'value', label: 'Value', portType: 'value', dataType: 'number' });
                    },
                    outputs: (): void => { }
                },
                code: (): string => ''
            }
        });

        // Process.
        const lResult = lDefinition.inputs;

        // Evaluation.
        expect(lResult.length).toBe(2);
        expect(lResult[0].id).toBe('exec');
        expect(lResult[0].portType).toBe('flow');
        expect(lResult[1].id).toBe('value');
        expect(lResult[1].dataType).toBe('number');
    });

    await pContext.step('Runs generator on every access', () => {
        // Setup.
        let lCallCount: number = 0;
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Test Node',
            category: { name: 'TestCategory' },
            generators: {
                ports: {
                    inputs: (): void => {
                        lCallCount++;
                    },
                    outputs: (): void => { }
                },
                code: (): string => ''
            }
        });

        // Process.
        void lDefinition.inputs;
        void lDefinition.inputs;

        // Evaluation.
        expect(lCallCount).toBe(2);
    });

    await pContext.step('Error - Multiple input flow ports', () => {
        // Setup.
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Test Node',
            category: { name: 'TestCategory' },
            generators: {
                ports: {
                    inputs: (pAddPort): void => {
                        pAddPort({ id: 'execOne', label: 'Exec One', portType: 'flow' });
                        pAddPort({ id: 'execTwo', label: 'Exec Two', portType: 'flow' });
                    },
                    outputs: (): void => { }
                },
                code: (): string => ''
            }
        });

        // Process.
        const lAction = (): void => {
            void lDefinition.inputs;
        };

        // Evaluation.
        expect(lAction).toThrow('Node definition TestNode has multiple input flow ports, which is not allowed.');
    });
});

Deno.test('PotatnoNodeDefinition.label', async (pContext) => {
    await pContext.step('Returns provided label', () => {
        // Setup.
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Provided Label',
            category: { name: 'TestCategory' },
            generators: {
                ports: {
                    inputs: (): void => { },
                    outputs: (): void => { }
                },
                code: (): string => ''
            }
        });

        // Process.
        const lResult: string = lDefinition.label;

        // Evaluation.
        expect(lResult).toBe('Provided Label');
    });
});

Deno.test('PotatnoNodeDefinition.outputs', async (pContext) => {
    await pContext.step('Returns generated output definitions', () => {
        // Setup.
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Test Node',
            category: { name: 'TestCategory' },
            generators: {
                ports: {
                    inputs: (): void => { },
                    outputs: (pAddPort): void => {
                        pAddPort({ id: 'exec', label: 'Exec', portType: 'flow' });
                        pAddPort({ id: 'value', label: 'Value', portType: 'value', dataType: 'number' });
                    }
                },
                code: (): string => ''
            }
        });

        // Process.
        const lResult = lDefinition.outputs;

        // Evaluation.
        expect(lResult.length).toBe(2);
        expect(lResult[0].id).toBe('exec');
        expect(lResult[0].portType).toBe('flow');
        expect(lResult[1].id).toBe('value');
        expect(lResult[1].dataType).toBe('number');
    });
});

Deno.test('PotatnoNodeDefinition.regions', async (pContext) => {
    await pContext.step('Returns configured regions', () => {
        // Setup.
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Test Node',
            category: { name: 'TestCategory' },
            regions: { add: ['RegionAdd'], allows: ['RegionAllowed'], requires: ['RegionRequired'] },
            generators: {
                ports: {
                    inputs: (): void => { },
                    outputs: (): void => { }
                },
                code: (): string => ''
            }
        });

        // Process.
        const lResult = lDefinition.regions;

        // Evaluation.
        expect(lResult.add).toEqual(['RegionAdd']);
        expect(lResult.allows).toEqual(['RegionAllowed']);
        expect(lResult.requires).toEqual(['RegionRequired']);
    });
});

Deno.test('PotatnoNodeDefinition.codeGenerator', async (pContext) => {
    await pContext.step('Returns provided code generator', () => {
        // Setup.
        const lCodeGenerator = (pContext: PotatnoNodeDefinitionGeneratorContext): string => {
            void pContext;
            return 'GeneratedCode';
        };
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Test Node',
            category: { name: 'TestCategory' },
            generators: {
                ports: {
                    inputs: (): void => { },
                    outputs: (): void => { }
                },
                code: lCodeGenerator
            }
        });

        // Process.
        const lResult = lDefinition.codeGenerator;

        // Evaluation.
        expect(lResult).toBe(lCodeGenerator);
        expect(lResult({ inputs: {}, outputs: {}, code: { next: '' } })).toBe('GeneratedCode');
    });
});

Deno.test('PotatnoNodeDefinition.getPort()', async (pContext) => {
    await pContext.step('Returns matching input port', () => {
        // Setup.
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Test Node',
            category: { name: 'TestCategory' },
            generators: {
                ports: {
                    inputs: (pAddPort): void => {
                        pAddPort({ id: 'inputValue', label: 'Input Value', portType: 'value', dataType: 'number' });
                    },
                    outputs: (pAddPort): void => {
                        pAddPort({ id: 'outputValue', label: 'Output Value', portType: 'value', dataType: 'number' });
                    }
                },
                code: (): string => ''
            }
        });

        // Process.
        const lResult = lDefinition.getPort('inputValue');

        // Evaluation.
        expect(lResult?.id).toBe('inputValue');
    });

    await pContext.step('Returns matching output port', () => {
        // Setup.
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Test Node',
            category: { name: 'TestCategory' },
            generators: {
                ports: {
                    inputs: (pAddPort): void => {
                        pAddPort({ id: 'inputValue', label: 'Input Value', portType: 'value', dataType: 'number' });
                    },
                    outputs: (pAddPort): void => {
                        pAddPort({ id: 'outputValue', label: 'Output Value', portType: 'value', dataType: 'number' });
                    }
                },
                code: (): string => ''
            }
        });

        // Process.
        const lResult = lDefinition.getPort('outputValue');

        // Evaluation.
        expect(lResult?.id).toBe('outputValue');
    });

    await pContext.step('Returns undefined for unknown port', () => {
        // Setup.
        const lDefinition = new PotatnoNodeDefinition<PotatnoTestProjectTypesDefinition>({
            id: 'TestNode',
            label: 'Test Node',
            category: { name: 'TestCategory' },
            generators: {
                ports: {
                    inputs: (): void => { },
                    outputs: (): void => { }
                },
                code: (): string => ''
            }
        });

        // Process.
        const lResult = lDefinition.getPort('missing');

        // Evaluation.
        expect(lResult).toBeUndefined();
    });
});
