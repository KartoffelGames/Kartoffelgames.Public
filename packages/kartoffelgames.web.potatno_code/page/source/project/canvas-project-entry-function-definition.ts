import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from '../../../source/project/potatno-function-definition.ts';
import { PotatnoStaticNodeDefinition } from '../../../source/project/node_definition/potatno-static-node-definition.ts';
import type { CanvasProject } from './canvas-project.ts';

/**
 * Entry point function definition for the canvas shader playground.
 */
export class CanvasProjectEntryFunctionDefinition extends PotatnoFunctionDefinition<CanvasProject> {
    /**
     * Create the canvas entry point function definition.
     */
    public constructor() {
        super({
            id: 'pixelShader',
            label: 'Pixel Shader',
            statics: PotatnoFunctionDefinitionStatics.imports | PotatnoFunctionDefinitionStatics.inputs,
            nodes: {
                entry: (pAddNode): void => {
                    pAddNode(new PotatnoStaticNodeDefinition<CanvasProject>({
                        id: 'OnPixel',
                        label: 'OnPixel',
                        category: 'event',
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
                    pAddNode(new PotatnoStaticNodeDefinition<CanvasProject>({
                        id: 'PixelResult',
                        label: 'PixelResult',
                        category: 'Output',
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
