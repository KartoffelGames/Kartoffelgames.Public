import { PotatnoStaticNodeDefinition } from '../../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from '../../../source/project/potatno-function-definition.ts';
import { PotatnoTestProjectGlobalMultiplierVariable } from './potatno-test-project-global-multiplier-variable.ts';
import type { PotatnoTestProjectTypesDefinition } from './potatno-test-project-types-definition.ts';

/**
 * Main calculator function definition for the PotatnoCode test project.
 */
export class PotatnoTestProjectCalculatorFunctionDefinition extends PotatnoFunctionDefinition<PotatnoTestProjectTypesDefinition> {
    /**
     * Create the main calculator function definition.
     */
    public constructor() {
        super({
            id: 'calculator',
            label: 'calculator',
            statics: PotatnoFunctionDefinitionStatics.imports | PotatnoFunctionDefinitionStatics.inputs | PotatnoFunctionDefinitionStatics.outputs,
            nodes: {
                entry: (pAddNode): void => {
                    pAddNode(new PotatnoStaticNodeDefinition({
                        id: 'CalculatorDefaultEntry',
                        label: 'Default',
                        category: { name: 'event' },
                        ports: {
                            inputs: [],
                            outputs: [
                                { label: 'exec', id: 'exec', portType: 'flow' },
                                { label: 'a', id: 'a', portType: 'value', dataType: 'number' },
                                { label: 'b', id: 'b', portType: 'value', dataType: 'number' }
                            ]
                        },
                        generators: {
                            code: (pContext): string => {
                                return `(${pContext.outputs['a'].value}, ${pContext.outputs['b'].value}) => { let ${PotatnoTestProjectGlobalMultiplierVariable} = 1; ${pContext.outputs['exec'].code.inner} }`;
                            }
                        }
                    }));
                    pAddNode(new PotatnoStaticNodeDefinition({
                        id: 'CalculatorX10Entry',
                        label: 'X10',
                        category: { name: 'event' },
                        ports: {
                            inputs: [],
                            outputs: [
                                { label: 'exec', id: 'exec', portType: 'flow' },
                                { label: 'a', id: 'a', portType: 'value', dataType: 'number' },
                                { label: 'b', id: 'b', portType: 'value', dataType: 'number' }
                            ]
                        },
                        generators: {
                            code: (pContext): string => {
                                return `(${pContext.outputs['a'].value}, ${pContext.outputs['b'].value}) => { let ${PotatnoTestProjectGlobalMultiplierVariable} = 1; ${pContext.outputs['exec'].code.inner} }`;
                            }
                        }
                    }));
                },
                exit: (pAddNode): void => {
                    pAddNode(new PotatnoStaticNodeDefinition({
                        id: 'CalculatorDefaultExit',
                        label: 'Default',
                        category: { name: 'output' },
                        ports: {
                            inputs: [
                                { label: 'exec', id: 'exec', portType: 'flow' },
                                { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                            ],
                            outputs: []
                        },
                        generators: {
                            code: (pContext): string => {
                                return `return (${pContext.inputs['result'].value}) * ${PotatnoTestProjectGlobalMultiplierVariable};`;
                            }
                        }
                    }));
                    pAddNode(new PotatnoStaticNodeDefinition({
                        id: 'CalculatorX10Exit',
                        label: 'X10',
                        category: { name: 'output' },
                        ports: {
                            inputs: [
                                { label: 'exec', id: 'exec', portType: 'flow' },
                                { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                            ],
                            outputs: []
                        },
                        generators: {
                            code: (pContext): string => {
                                return `return ((${pContext.inputs['result'].value}) * 10) * ${PotatnoTestProjectGlobalMultiplierVariable};`;
                            }
                        }
                    }));
                }
            },
            generator: {
                code: {
                    body: (pResult): string => {
                        const lFunctionName: string = pResult.function.project.generator.value.name(pResult.function.label);
                        const lDefaultGraph = pResult.graphResultOf('CalculatorDefaultEntry');
                        const lParts: Array<string> = [];
                        const lX10Graph = pResult.graphResultOf('CalculatorX10Entry');

                        if (lDefaultGraph) {
                            lParts.push(`const ${lFunctionName}Default = ${lDefaultGraph.code};`);
                        }

                        if (lX10Graph) {
                            lParts.push(`const ${lFunctionName}X10 = ${lX10Graph.code};`);
                        }

                        return lParts.join('');
                    },
                    value: (pContext): string => {
                        const lFunctionName: string = pContext.function.project.generator.value.name(pContext.function.label);
                        const lArgs: string = Object.values(pContext.inputs)
                            .map((pInput) => pInput.value)
                            .join(', ');
                        return `${lFunctionName}Default(${lArgs})`;
                    }
                }
            }
        });
    }
}
