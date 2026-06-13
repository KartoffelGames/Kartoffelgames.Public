import { PotatnoStaticNodeDefinition } from '../../../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoImportDefinition } from '../../../../source/project/potatno-import-definition.ts';
import { CanvasProjectTypesDefinition } from "../canvas-project-types-definition.ts";

/**
 * Math import definition for the canvas shader playground.
 */
export class CanvasProjectMathImportDefinition extends PotatnoImportDefinition<CanvasProjectTypesDefinition> {
    /**
     * Create the math import definition.
     */
    public constructor() {
        super('Math', 'Math');

        // Register math constants and functions.
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'Math.PI',
            label: 'Math.PI',
            category: 'value',
            ports: {
                inputs: [],
                outputs: [
                    { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['value'].value} = Math.PI;`
            }
        }));
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'Math.E',
            label: 'Math.E',
            category: 'value',
            ports: {
                inputs: [],
                outputs: [
                    { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['value'].value} = Math.E;`
            }
        }));
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'Math.abs',
            label: 'Math.abs',
            category: 'Function',
            ports: {
                inputs: [
                    { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = Math.abs(${pContext.inputs['value'].value});`
            }
        }));
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'Math.floor',
            label: 'Math.floor',
            category: 'Function',
            ports: {
                inputs: [
                    { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = Math.floor(${pContext.inputs['value'].value});`
            }
        }));
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'Math.random',
            label: 'Math.random',
            category: 'Function',
            ports: {
                inputs: [],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = Math.random();`
            }
        }));
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'Math.sin',
            label: 'Math.sin',
            category: 'Function',
            ports: {
                inputs: [
                    { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = Math.sin(${pContext.inputs['value'].value});`
            }
        }));
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'Math.cos',
            label: 'Math.cos',
            category: 'Function',
            ports: {
                inputs: [
                    { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = Math.cos(${pContext.inputs['value'].value});`
            }
        }));
    }
}
