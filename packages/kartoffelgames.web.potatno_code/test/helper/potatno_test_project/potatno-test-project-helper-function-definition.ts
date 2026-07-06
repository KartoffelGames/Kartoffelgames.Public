import { PotatnoNodeDefinition } from '../../../source/project/node_definition/potatno-node-definition.ts';
import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from '../../../source/project/potatno-function-definition.ts';
import { PotatnoTestProjectGlobalMultiplierVariable } from './potatno-test-project-global-multiplier-variable.ts';
import type { PotatnoTestProjectTypesDefinition } from './potatno-test-project-types-definition.ts';

/**
 * Dynamic helper function definition for the PotatnoCode test project.
 */
export class PotatnoTestProjectHelperFunctionDefinition extends PotatnoFunctionDefinition<PotatnoTestProjectTypesDefinition> {
    /**
     * Create the dynamic helper function definition.
     */
    public constructor() {
        super({
            id: 'helperFunction',
            label: 'helperFunction',
            statics: PotatnoFunctionDefinitionStatics.none,
            nodes: {
                entry: (pAddNode, pFunction): void => {
                    pAddNode(new PotatnoNodeDefinition({
                        id: 'HelperEntry',
                        label: 'Entry',
                        category: {
                            name: 'event'
                        },
                        generators: {
                            ports: {
                                inputs: (): void => { /* No inputs on entry nodes. */ },
                                outputs: (pAddPort): void => {
                                    pAddPort({ label: 'exec', id: 'exec', portType: 'flow' });

                                    for (const lInput of pFunction.inputs) {
                                        pAddPort({ label: lInput.label, id: lInput.label, portType: 'value', dataType: lInput.dataType });
                                    }
                                }
                            },
                            code: (pContext): string => {
                                const lParameters: string = Object.values(pContext.outputs)
                                    .filter((pOutput) => pOutput.value !== '')
                                    .map((pOutput) => pOutput.value)
                                    .join(', ');

                                return `(${lParameters}) => { let ${PotatnoTestProjectGlobalMultiplierVariable} = 1; ${pContext.outputs['exec'].code.inner} }`;
                            }
                        }
                    }));
                },
                exit: (pAddNode, pFunction): void => {
                    pAddNode(new PotatnoNodeDefinition({
                        id: 'HelperExit',
                        label: 'Return',
                        category: {
                            name: 'event'
                        },
                        generators: {
                            ports: {
                                inputs: (pAddPort): void => {
                                    pAddPort({ label: 'exec', id: 'exec', portType: 'flow' });

                                    for (const lOutput of pFunction.outputs) {
                                        pAddPort({ label: lOutput.label, id: lOutput.label, portType: 'value', dataType: lOutput.dataType });
                                    }
                                },
                                outputs: (): void => { /* No outputs on exit nodes. */ }
                            },
                            code: (pContext): string => {
                                const lReturnFields: string = Object.entries(pContext.inputs)
                                    .filter(([pId]) => pId !== 'exec')
                                    .map(([pId, pInput]) => `${pId}: (${pInput.value}) * ${PotatnoTestProjectGlobalMultiplierVariable}`)
                                    .join(', ');

                                return `return { ${lReturnFields} };`;
                            }
                        }
                    }));
                }
            },
            generator: {
                code: {
                    body: (pResult): string => {
                        const lGraph = pResult.graphResultOf('HelperEntry');
                        return `const ${pResult.function.label} = ${lGraph?.code ?? '() => undefined'};`;
                    },
                    value: (pContext): string => {
                        const lFunctionName: string = pContext.function.label;
                        const lArgs: string = Object.values(pContext.inputs)
                            .map((pInput) => pInput.value)
                            .join(', ');
                        const lOutputEntries: Array<[string, string]> = Object.entries(pContext.outputs)
                            .filter(([pId, pOutput]) => pId !== 'exec' && pOutput.value !== '')
                            .map(([pId, pOutput]) => [pId, pOutput.value]);

                        if (lOutputEntries.length === 0) {
                            return `${lFunctionName}(${lArgs}); ${pContext.outputs['exec']?.code.inner ?? ''}`;
                        }

                        const lDestructure: string = lOutputEntries
                            .map(([pId, pValueId]) => `${pId}: ${pValueId}`)
                            .join(', ');

                        return `const { ${lDestructure} } = ${lFunctionName}(${lArgs}); ${pContext.outputs['exec']?.code.inner ?? ''}`;
                    }
                }
            }
        });
    }
}
