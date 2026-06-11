import { expect } from '@kartoffelgames/core-test';
import { FlowConjunctionNodeDefinition } from '../../source/project/node_definition/potatno-flow-conjunction-node-definition.ts';
import { PotatnoStaticNodeDefinition } from '../../source/project/node_definition/potatno-static-node-definition.ts';
import { ValueConjunctionNodeDefinition } from '../../source/project/node_definition/potatno-value-conjunction-node-definition.ts';
import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from '../../source/project/potatno-function-definition.ts';
import { PotatnoProjectTypesDefinition } from '../../source/project/potatno-project-types-definition.ts';
import { PotatnoProject } from '../../source/project/potatno-project.ts';

const lNewBareProject = (): PotatnoProject<PotatnoProjectTypesDefinition<'number'>> => {
    const lTypes = new PotatnoProjectTypesDefinition({
        number: {
            default: { string: ['0'], value: 0 },
            convert: (pValues: Array<string>): string => pValues[0],
            inputs: [{ name: 'value', type: 'number' }]
        }
    });

    const lEntry = new PotatnoFunctionDefinition({
        id: 'entry',
        label: 'entry',
        statics: PotatnoFunctionDefinitionStatics.none,
        nodes: {},
        generator: {
            code: {
                body: (): string => '',
                value: (): string => ''
            }
        }
    });

    return new PotatnoProject(lTypes, lEntry, {
        generator: {
            code: (): string => '',
            values: {
                valueId: (pValueIndex: number): string => {
                    return `v_${pValueIndex}`;
                },
                hook: (pValueId: string): string => {
                    return `/*[${pValueId}]*/`;
                }
            }
        }
    });
};

Deno.test('new PotatnoProject()', async (pContext) => {
    await pContext.step('Construct with minimal config', () => {
        // Setup. Process.
        const lProject = lNewBareProject();

        // Evaluation.
        expect(lProject).toBeDefined();
        expect(lProject.entryPoint).toBeDefined();
    });

    await pContext.step('Set dynamic user functions', () => {
        // Setup.
        const lTypes = new PotatnoProjectTypesDefinition({
            number: {
                default: { string: ['0'], value: 0 },
                convert: (pValues: Array<string>): string => pValues[0],
                inputs: [{ name: 'value', type: 'number' }]
            }
        });

        const lEntry = new PotatnoFunctionDefinition({
            id: 'entry', label: 'entry',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: { code: { body: (): string => '', value: (): string => '' } }
        });

        const lUserFunction = new PotatnoFunctionDefinition({
            id: 'userOne', label: 'userOne',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: { code: { body: (): string => '', value: (): string => '' } }
        });

        // Process.
        const lProject = new PotatnoProject(lTypes, lEntry, {
            generator: {
                code: (): string => '',
                values: {
                    valueId: (pValueIndex: number): string => {
                        return `v_${pValueIndex}`;
                    },
                    hook: (pValueId: string): string => {
                        return `/*[${pValueId}]*/`;
                    }
                }
            }
        });
        lProject.setDynamicFunction(lUserFunction);

        // Evaluation.
        expect(lProject.userFunctions.has('userOne')).toBe(true);
        expect(lProject.userFunctions.get('userOne')).toBe(lUserFunction);
    });

    await pContext.step('Construct registers built-in conjunction nodes', () => {
        // Setup. Process.
        const lProject = lNewBareProject();
        const lIds: Array<string> = lProject.nodeDefinitions.map((pDef) => pDef.id);

        // Evaluation.
        expect(lIds).toContain(FlowConjunctionNodeDefinition.DEFINITION_ID);
        expect(lIds).toContain(ValueConjunctionNodeDefinition.DEFINITION_ID);
    });
});

Deno.test('PotatnoProject.types', async (pContext) => {
    await pContext.step('Returns the provided types definition', () => {
        // Setup.
        const lTypes = new PotatnoProjectTypesDefinition({
            number: {
                default: { string: ['0'], value: 0 },
                convert: (pValues: Array<string>): string => pValues[0],
                inputs: [{ name: 'value', type: 'number' }]
            }
        });
        const lEntry = new PotatnoFunctionDefinition({
            id: 'entry', label: 'entry',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: { code: { body: (): string => '', value: (): string => '' } }
        });
        const lProject = new PotatnoProject(lTypes, lEntry, {
            generator: {
                code: (): string => '',
                values: {
                    valueId: (pValueIndex: number): string => {
                        return `v_${pValueIndex}`;
                    },
                    hook: (pValueId: string): string => {
                        return `/*[${pValueId}]*/`;
                    }
                }
            }
        });

        // Process.
        const lResult = lProject.types;

        // Evaluation.
        expect(lResult).toBe(lTypes);
    });
});

Deno.test('PotatnoProject.entryPoint', async (pContext) => {
    await pContext.step('Returns the entry function definition', () => {
        // Setup.
        const lTypes = new PotatnoProjectTypesDefinition({
            number: {
                default: { string: ['0'], value: 0 },
                convert: (pValues: Array<string>): string => pValues[0],
                inputs: [{ name: 'value', type: 'number' }]
            }
        });
        const lEntry = new PotatnoFunctionDefinition({
            id: 'entry', label: 'entry',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: { code: { body: (): string => '', value: (): string => '' } }
        });
        const lProject = new PotatnoProject(lTypes, lEntry, {
            generator: {
                code: (): string => '',
                values: {
                    valueId: (pValueIndex: number): string => {
                        return `v_${pValueIndex}`;
                    },
                    hook: (pValueId: string): string => {
                        return `/*[${pValueId}]*/`;
                    }
                }
            }
        });

        // Process.
        const lResult = lProject.entryPoint;

        // Evaluation.
        expect(lResult).toBe(lEntry);
    });
});

Deno.test('PotatnoProject.userFunctions', async (pContext) => {
    await pContext.step('Empty when none provided', () => {
        // Setup. Process.
        const lProject = lNewBareProject();

        // Evaluation.
        expect(lProject.userFunctions.size).toBe(0);
    });

    await pContext.step('Contains added user functions keyed by id', () => {
        // Setup.
        const lTypes = new PotatnoProjectTypesDefinition({
            number: {
                default: { string: ['0'], value: 0 },
                convert: (pValues: Array<string>): string => pValues[0],
                inputs: [{ name: 'value', type: 'number' }]
            }
        });
        const lEntry = new PotatnoFunctionDefinition({
            id: 'entry', label: 'entry',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: { code: { body: (): string => '', value: (): string => '' } }
        });
        const lFunctionOne = new PotatnoFunctionDefinition({
            id: 'one', label: 'one',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: { code: { body: (): string => '', value: (): string => '' } }
        });
        const lFunctionTwo = new PotatnoFunctionDefinition({
            id: 'two', label: 'two',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: { code: { body: (): string => '', value: (): string => '' } }
        });

        // Process.
        const lProject = new PotatnoProject(lTypes, lEntry, {
            generator: {
                code: (): string => '',
                values: {
                    valueId: (pValueIndex: number): string => {
                        return `v_${pValueIndex}`;
                    },
                    hook: (pValueId: string): string => {
                        return `/*[${pValueId}]*/`;
                    }
                }
            }
        });
        lProject.setDynamicFunction(lFunctionOne);
        lProject.setDynamicFunction(lFunctionTwo);

        // Evaluation.
        expect(lProject.userFunctions.size).toBe(2);
        expect(lProject.userFunctions.get('one')).toBe(lFunctionOne);
        expect(lProject.userFunctions.get('two')).toBe(lFunctionTwo);
    });
});

Deno.test('PotatnoProject.imports', async (pContext) => {
    await pContext.step('Empty when none added', () => {
        // Setup. Process.
        const lProject = lNewBareProject();

        // Evaluation.
        expect(lProject.imports.length).toBe(0);
    });

    await pContext.step('Contains added imports in insertion order', () => {
        // Setup.
        const lProject = lNewBareProject();
        const lImportOne = { id: 'one', label: 'one', nodes: [] };
        const lImportTwo = { id: 'two', label: 'two', nodes: [] };

        // Process.
        lProject.addImport(lImportOne);
        lProject.addImport(lImportTwo);

        // Evaluation.
        expect(lProject.imports.length).toBe(2);
        expect(lProject.imports[0]).toBe(lImportOne);
        expect(lProject.imports[1]).toBe(lImportTwo);
    });
});

Deno.test('PotatnoProject.nodeDefinitions', async (pContext) => {
    await pContext.step('Returns conjunction nodes when no nodes added', () => {
        // Setup. Process.
        const lProject = lNewBareProject();

        // Evaluation. Two built-in conjunction nodes are always present.
        expect(lProject.nodeDefinitions.length).toBe(2);
    });

    await pContext.step('Returns added node definitions plus conjunctions', () => {
        // Setup.
        const lProject = lNewBareProject();
        const lAddedDefinition = new PotatnoStaticNodeDefinition({
            id: 'Marker',
            label: 'Marker',
            category: 'operator',
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });

        // Process.
        lProject.addNodeDefinition(lAddedDefinition);

        // Evaluation.
        expect(lProject.nodeDefinitions.length).toBe(3);
        expect(lProject.nodeDefinitions.map((pDef) => pDef.id)).toContain('Marker');
    });
});

Deno.test('PotatnoProject.generator', async (pContext) => {
    await pContext.step('Returns the provided generator object', () => {
        // Setup.
        const lTypes = new PotatnoProjectTypesDefinition({
            number: {
                default: { string: ['0'], value: 0 },
                convert: (pValues: Array<string>): string => pValues[0],
                inputs: [{ name: 'value', type: 'number' }]
            }
        });
        const lEntry = new PotatnoFunctionDefinition({
            id: 'entry', label: 'entry',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: { code: { body: (): string => '', value: (): string => '' } }
        });
        const lGenerator = {
            code: (): string => 'expected',
            values: {
                valueId: (pValueIndex: number): string => {
                    return `v_${pValueIndex}`;
                },
                hook: (pValueId: string): string => {
                    return `<${pValueId}>`;
                }
            }
        };

        // Process.
        const lProject = new PotatnoProject(lTypes, lEntry, {
            generator: lGenerator
        });

        // Evaluation.
        expect(lProject.generator).toBe(lGenerator);
    });
});

Deno.test('PotatnoProject.addImport()', async (pContext) => {
    await pContext.step('Appends a single import', () => {
        // Setup.
        const lProject = lNewBareProject();
        const lImport = { id: 'lib', label: 'lib', nodes: [] };

        // Process.
        lProject.addImport(lImport);

        // Evaluation.
        expect(lProject.imports.length).toBe(1);
        expect(lProject.imports[0]).toBe(lImport);
    });

    await pContext.step('Appends multiple imports in call order', () => {
        // Setup.
        const lProject = lNewBareProject();
        const lImportOne = { id: 'one', label: 'one', nodes: [] };
        const lImportTwo = { id: 'two', label: 'two', nodes: [] };
        const lImportThree = { id: 'three', label: 'three', nodes: [] };

        // Process.
        lProject.addImport(lImportOne);
        lProject.addImport(lImportTwo);
        lProject.addImport(lImportThree);

        // Evaluation.
        expect(lProject.imports.map((pImport) => pImport.id)).toEqual(['one', 'two', 'three']);
    });
});

Deno.test('PotatnoProject.addNodeDefinition()', async (pContext) => {
    await pContext.step('Registers a node definition by id', () => {
        // Setup.
        const lProject = lNewBareProject();
        const lDefinition = new PotatnoStaticNodeDefinition({
            id: 'TestDefinition',
            label: 'TestDefinition',
            category: 'operator',
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => '' }
        });

        // Process.
        lProject.addNodeDefinition(lDefinition);

        // Evaluation.
        expect(lProject.nodeDefinitions.map((pDef) => pDef.id)).toContain('TestDefinition');
    });

    await pContext.step('Re-registering the same id overwrites the previous definition', () => {
        // Setup.
        const lProject = lNewBareProject();
        const lFirst = new PotatnoStaticNodeDefinition({
            id: 'Same',
            label: 'first',
            category: 'operator',
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => 'first' }
        });
        const lSecond = new PotatnoStaticNodeDefinition({
            id: 'Same',
            label: 'second',
            category: 'operator',
            ports: { inputs: [], outputs: [] },
            generators: { code: (): string => 'second' }
        });

        // Process.
        lProject.addNodeDefinition(lFirst);
        lProject.addNodeDefinition(lSecond);

        // Evaluation. Only one entry with id 'Same'; it points at lSecond.
        const lMatches = lProject.nodeDefinitions.filter((pDef) => pDef.id === 'Same');
        expect(lMatches.length).toBe(1);
        expect(lMatches[0]).toBe(lSecond);
    });
});

Deno.test('PotatnoProject.getFunction()', async (pContext) => {
    await pContext.step('Returns the entry function when its id matches', () => {
        // Setup. Process.
        const lProject = lNewBareProject();

        // Evaluation.
        expect(lProject.getFunction('entry')).toBe(lProject.entryPoint);
    });

    await pContext.step('Returns a user function when its id matches', () => {
        // Setup.
        const lTypes = new PotatnoProjectTypesDefinition({
            number: {
                default: { string: ['0'], value: 0 },
                convert: (pValues: Array<string>): string => pValues[0],
                inputs: [{ name: 'value', type: 'number' }]
            }
        });
        const lEntry = new PotatnoFunctionDefinition({
            id: 'entry', label: 'entry',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: { code: { body: (): string => '', value: (): string => '' } }
        });
        const lUserFunction = new PotatnoFunctionDefinition({
            id: 'user', label: 'user',
            statics: PotatnoFunctionDefinitionStatics.none, nodes: {},
            generator: { code: { body: (): string => '', value: (): string => '' } }
        });

        // Process.
        const lProject = new PotatnoProject(lTypes, lEntry, {
            generator: {
                code: (): string => '',
                values: {
                    valueId: (pValueIndex: number): string => {
                        return `v_${pValueIndex}`;
                    },
                    hook: (pValueId: string): string => {
                        return `/*[${pValueId}]*/`;
                    }
                }
            }
        });
        lProject.setDynamicFunction(lUserFunction);

        // Evaluation.
        expect(lProject.getFunction('user')).toBe(lUserFunction);
    });

    await pContext.step('Returns undefined for unknown id', () => {
        // Setup. Process.
        const lProject = lNewBareProject();

        // Evaluation.
        expect(lProject.getFunction('does-not-exist')).toBeUndefined();
    });
});
