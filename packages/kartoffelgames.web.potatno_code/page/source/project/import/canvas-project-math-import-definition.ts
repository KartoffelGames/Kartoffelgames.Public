import { PotatnoStaticNodeDefinition } from '../../../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoImportDefinition } from '../../../../source/project/potatno-import-definition.ts';
import type { CanvasProjectTypesDefinition } from '../canvas-project-types-definition.ts';

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
            category: { name: 'value' },
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
            category: { name: 'value' },
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
            category: { name: 'Function' },
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
            category: { name: 'Function' },
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
            id: 'Math.ceil',
            label: 'Math.ceil',
            category: { name: 'Function' },
            ports: {
                inputs: [
                    { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = Math.ceil(${pContext.inputs['value'].value});`
            }
        }));
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'Math.random',
            label: 'Math.random',
            category: { name: 'Function' },
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
            category: { name: 'Function' },
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
            category: { name: 'Function' },
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
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'Math.min',
            label: 'Math.min',
            category: { name: 'Function' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'number' },
                    { label: 'b', id: 'b', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = Math.min(${pContext.inputs['a'].value}, ${pContext.inputs['b'].value});`
            }
        }));
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'Math.max',
            label: 'Math.max',
            category: { name: 'Function' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'number' },
                    { label: 'b', id: 'b', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = Math.max(${pContext.inputs['a'].value}, ${pContext.inputs['b'].value});`
            }
        }));
        this.addNode(new PotatnoStaticNodeDefinition({
            id: 'Math.clamp',
            label: 'Math.clamp',
            category: { name: 'Function' },
            ports: {
                inputs: [
                    { label: 'value', id: 'value', portType: 'value', dataType: 'number' },
                    { label: 'min', id: 'min', portType: 'value', dataType: 'number' },
                    { label: 'max', id: 'max', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = Math.min(Math.max(${pContext.inputs['value'].value}, ${pContext.inputs['min'].value}), ${pContext.inputs['max'].value});`
            }
        }));
    }
}
