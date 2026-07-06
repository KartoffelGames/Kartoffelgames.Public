import { PotatnoStaticNodeDefinition } from '../../../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from '../../../../source/project/potatno-function-definition.ts';
import type { CanvasProjectTypesDefinition } from '../canvas-project-types-definition.ts';

/**
 * Entry point function definition for the canvas shader playground.
 */
export class CanvasProjectEntryFunctionDefinition extends PotatnoFunctionDefinition<CanvasProjectTypesDefinition> {
    /**
     * Create the canvas entry point function definition.
     */
    public constructor() {
        super({
            id: 'pixelShader',
            label: 'Pixel Shader',
            statics: PotatnoFunctionDefinitionStatics.inputs | PotatnoFunctionDefinitionStatics.outputs,
            nodes: {
                entry: (pAddNode): void => {
                    pAddNode(new PotatnoStaticNodeDefinition({
                        id: 'OnPixel',
                        label: 'OnPixel',
                        category: { name: 'event' },
                        ports: {
                            inputs: [],
                            outputs: [
                                { label: 'exec', id: 'exec', portType: 'flow' },
                                { label: 'x', id: 'x', portType: 'value', dataType: 'number' },
                                { label: 'y', id: 'y', portType: 'value', dataType: 'number' }
                            ]
                        },
                        generators: {
                            code: (pContext): string => {
                                const lX: string = pContext.outputs['x'].value;
                                const lY: string = pContext.outputs['y'].value;
                                return `(${lX}, ${lY}) => { ${pContext.outputs['exec'].code.inner} }`;
                            }
                        }
                    }));
                },
                exit: (pAddNode): void => {
                    pAddNode(new PotatnoStaticNodeDefinition({
                        id: 'PixelResult',
                        label: 'PixelResult',
                        category: { name: 'Output' },
                        ports: {
                            inputs: [
                                { label: 'exec', id: 'exec', portType: 'flow' },
                                { label: 'red', id: 'red', portType: 'value', dataType: 'number' },
                                { label: 'green', id: 'green', portType: 'value', dataType: 'number' },
                                { label: 'blue', id: 'blue', portType: 'value', dataType: 'number' }
                            ],
                            outputs: []
                        },
                        generators: {
                            code: (pContext): string => {
                                return `return [${pContext.inputs['red'].value}, ${pContext.inputs['green'].value}, ${pContext.inputs['blue'].value}];`;
                            }
                        }
                    }));
                }
            },
            generator: {
                code: {
                    body: (pResult): string => {
                        const lGraph = pResult.graphResultOf('OnPixel');
                        return `const ${pResult.function.definitionId} = ${lGraph?.code ?? '() => [0, 0, 0]'};`;
                    },
                    value: (pContext): string => {
                        return `${pContext.function.definitionId}()`;
                    }
                }
            },
        });
    }
}
