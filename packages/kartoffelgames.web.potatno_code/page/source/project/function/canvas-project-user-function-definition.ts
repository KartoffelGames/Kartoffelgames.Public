import { PotatnoNodeDefinition } from '../../../../source/project/node_definition/potatno-node-definition.ts';
import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from '../../../../source/project/potatno-function-definition.ts';
import { CanvasProjectTypesDefinition } from "../canvas-project-types-definition.ts";

/**
 * User function definition for the canvas shader playground.
 */
export class CanvasProjectUserFunctionDefinition extends PotatnoFunctionDefinition<CanvasProjectTypesDefinition> {
    /**
     * Create the canvas user function definition.
     */
    public constructor() {
        super({
            id: 'Helper Function',
            label: 'Helper Function',
            statics: PotatnoFunctionDefinitionStatics.none,
            nodes: {
                entry: (pAddNode, pFunction): void => {
                    pAddNode(new PotatnoNodeDefinition({
                        id: 'HelperFunctionEntry',
                        label: 'Entry',
                        category: 'event',
                        generators: {
                            ports: {
                                outputs: (pAddPort): void => {
                                    pAddPort({ label: 'exec', id: 'exec', portType: 'flow' });

                                    for (const lOutput of pFunction.inputs) {
                                        pAddPort({ label: lOutput.label, id: lOutput.label, portType: 'value', dataType: lOutput.dataType });
                                    }
                                },
                                inputs: (): void => { }
                            },
                            code: (pContext): string => {
                                const lParameters: string = Object.entries(pContext.outputs)
                                    .filter(([lId]) => lId !== 'exec')
                                    .map(([, lOutput]) => lOutput.value)
                                    .join(', ');

                                return `(${lParameters}) => { ${pContext.outputs['exec'].code.inner} }`;
                            }
                        }
                    }));
                },
                exit: (pAddNode, pFunction): void => {
                    pAddNode(new PotatnoNodeDefinition({
                        id: 'HelperFunctionReturn',
                        label: 'Return',
                        category: 'event',
                        generators: {
                            ports: {
                                outputs: (): void => { },
                                inputs: (pAddPort): void => {
                                    pAddPort({ label: 'exec', id: 'exec', portType: 'flow' });

                                    for (const lOutput of pFunction.outputs) {
                                        pAddPort({ label: lOutput.label, id: lOutput.label, portType: 'value', dataType: lOutput.dataType });
                                    }
                                }
                            },
                            code: (pContext): string => {
                                const lReturnFields: string = Object.entries(pContext.inputs)
                                    .map(([lId, lInput]) => `${lId}: (${lInput.value})`)
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
                        const lFunctionName: string = `__fn_${pResult.function.id.replaceAll('-', '_')}`;
                        const lGraph = pResult.graphResultOf('HelperFunctionEntry');
                        return `const ${lFunctionName} = ${lGraph?.code ?? '() => ({})'};`;
                    },
                    value: (pContext): string => {
                        const lFunctionName: string = `__fn_${pContext.function.id.replaceAll('-', '_')}`;
                        const lArgs: string = Object.entries(pContext.inputs)
                            .map(([, lInput]) => lInput.value)
                            .join(', ');
                        const lDestructure: string = Object.entries(pContext.outputs)
                            .filter(([lId]) => lId !== 'Output')
                            .map(([lId, lOutput]) => `${lId}: ${lOutput.value}`)
                            .join(', ');
                        const lFlowNext: string = pContext.outputs['Output']?.code.inner ?? '';

                        if (lDestructure === '') {
                            return `${lFunctionName}(${lArgs}); ${lFlowNext}`;
                        }

                        return `const { ${lDestructure} } = ${lFunctionName}(${lArgs}); ${lFlowNext}`;
                    }
                }
            }
        });
    }
}
