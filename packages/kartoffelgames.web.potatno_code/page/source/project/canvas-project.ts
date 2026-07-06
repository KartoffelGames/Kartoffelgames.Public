import { PotatnoStaticNodeDefinition } from '../../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoProject } from '../../../source/project/potatno-project.ts';
import { CanvasProjectTypesDefinition } from './canvas-project-types-definition.ts';
import { CanvasProjectEntryFunctionDefinition } from './function/canvas-project-entry-function-definition.ts';
import { CanvasProjectUserFunctionDefinition } from './function/canvas-project-user-function-definition.ts';

/**
 * Project configuration for the canvas shader playground.
 */
export class CanvasProject extends PotatnoProject<CanvasProjectTypesDefinition> {
    private readonly mUserFunction: CanvasProjectUserFunctionDefinition;

    /**
     * Get the user function definition used by the playground.
     */
    public get userFunction(): CanvasProjectUserFunctionDefinition {
        return this.mUserFunction;
    }

    /**
     * Create the canvas project configuration.
     */
    public constructor() {
        const lTypes = new CanvasProjectTypesDefinition();
        const lEntryFunction = new CanvasProjectEntryFunctionDefinition();
        const lUserFunction = new CanvasProjectUserFunctionDefinition();

        super(lTypes, lEntryFunction, {
            generator: {
                code: (pContext): string => {
                    let lCodeResult: string = '';

                    for (const lDependency of pContext.dependencies) {
                        lCodeResult += `${lDependency.code}\n`;
                    }

                    lCodeResult += pContext.entryPoint.code;

                    return lCodeResult;
                },
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

        // Register function, imports and base nodes.
        this.mUserFunction = lUserFunction;
        this.setDynamicFunction(lUserFunction);
        this.addBaseNodeDefinitions();
    }

    /**
     * Register base node definitions.
     */
    private addBaseNodeDefinitions(): void {
        // Register arithmetic nodes.
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Add',
            label: 'Add',
            category: { name: 'operator' },
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
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} + ${pContext.inputs['b'].value};`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Subtract',
            label: 'Subtract',
            category: { name: 'operator' },
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
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} - ${pContext.inputs['b'].value};`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Multiply',
            label: 'Multiply',
            category: { name: 'operator' },
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
                code: (pContext): string => {
                    return `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} * ${pContext.inputs['b'].value};`
                        + `/*MULTIPLYHOOK_${pContext.outputs['result'].value}*/`;
                }
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Divide',
            label: 'Divide',
            category: { name: 'operator' },
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
                code: (pContext): string => {
                    return `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} / ${pContext.inputs['b'].value};`;
                }
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Modulo',
            label: 'Modulo',
            category: { name: 'operator' },
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
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} % ${pContext.inputs['b'].value};`
            }
        }));

        // Register comparison nodes.
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Equal',
            label: 'Equal',
            category: { name: 'operator' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'number' },
                    { label: 'b', id: 'b', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'boolean' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} === ${pContext.inputs['b'].value};`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Not Equal',
            label: 'Not Equal',
            category: { name: 'operator' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'number' },
                    { label: 'b', id: 'b', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'boolean' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} !== ${pContext.inputs['b'].value};`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Less Than',
            label: 'Less Than',
            category: { name: 'operator' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'number' },
                    { label: 'b', id: 'b', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'boolean' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} < ${pContext.inputs['b'].value};`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Greater Than',
            label: 'Greater Than',
            category: { name: 'operator' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'number' },
                    { label: 'b', id: 'b', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'boolean' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} > ${pContext.inputs['b'].value};`
            }
        }));

        // Register logic nodes.
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'And',
            label: 'And',
            category: { name: 'operator' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'boolean' },
                    { label: 'b', id: 'b', portType: 'value', dataType: 'boolean' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'boolean' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} && ${pContext.inputs['b'].value};`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Or',
            label: 'Or',
            category: { name: 'operator' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'boolean' },
                    { label: 'b', id: 'b', portType: 'value', dataType: 'boolean' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'boolean' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} || ${pContext.inputs['b'].value};`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Not',
            label: 'Not',
            category: { name: 'operator' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'boolean' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'boolean' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = !${pContext.inputs['a'].value};`
            }
        }));

        // Register type conversion nodes.
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Number to String',
            label: 'Number to String',
            category: { name: 'type-conversion' },
            ports: {
                inputs: [
                    { label: 'input', id: 'input', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'output', id: 'output', portType: 'value', dataType: 'string' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['output'].value} = String(${pContext.inputs['input'].value});`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'String to Number',
            label: 'String to Number',
            category: { name: 'type-conversion' },
            ports: {
                inputs: [
                    { label: 'input', id: 'input', portType: 'value', dataType: 'string' }
                ],
                outputs: [
                    { label: 'output', id: 'output', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['output'].value} = Number(${pContext.inputs['input'].value});`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Boolean to String',
            label: 'Boolean to String',
            category: { name: 'type-conversion' },
            ports: {
                inputs: [
                    { label: 'input', id: 'input', portType: 'value', dataType: 'boolean' }
                ],
                outputs: [
                    { label: 'output', id: 'output', portType: 'value', dataType: 'string' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['output'].value} = String(${pContext.inputs['input'].value});`
            }
        }));

        // Register flow nodes.
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'If',
            label: 'If',
            category: { name: 'flow' },
            ports: {
                inputs: [
                    { label: 'exec', id: 'exec', portType: 'flow' },
                    { label: 'condition', id: 'condition', portType: 'value', dataType: 'boolean' }
                ],
                outputs: [
                    { label: 'then', id: 'then', portType: 'flow' },
                    { label: 'else', id: 'else', portType: 'flow' }
                ]
            },
            generators: {
                code: (pContext): string => `if (${pContext.inputs['condition'].value}) {\n${pContext.outputs['then'].code.inner}\n} else {\n${pContext.outputs['else'].code.inner}\n}`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'While',
            label: 'While',
            category: { name: 'flow' },
            ports: {
                inputs: [
                    { label: 'exec', id: 'exec', portType: 'flow' },
                    { label: 'condition', id: 'condition', portType: 'value', dataType: 'boolean' }
                ],
                outputs: [
                    { label: 'body', id: 'body', portType: 'flow' }
                ]
            },
            generators: {
                code: (pContext): string => `while (${pContext.inputs['condition'].value}) {\n${pContext.outputs['body'].code.inner}\n}`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'For Loop',
            label: 'For Loop',
            category: { name: 'flow' },
            ports: {
                inputs: [
                    { label: 'exec', id: 'exec', portType: 'flow' },
                    { label: 'count', id: 'count', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'exec', id: 'exec', portType: 'flow' },
                    { label: 'index', id: 'index', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `for (let ${pContext.outputs['index'].value} = 0; ${pContext.outputs['index'].value} < ${pContext.inputs['count'].value}; ${pContext.outputs['index'].value}++) {\n${pContext.outputs['exec'].code.inner}\n}`
            }
        }));

        // Register function nodes.
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Console Log',
            label: 'Console Log',
            category: { name: 'Function' },
            ports: {
                inputs: [{ label: 'message', id: 'message', portType: 'value', dataType: 'string' }],
                outputs: []
            },
            generators: {
                code: (pContext): string => `console.log(${pContext.inputs['message'].value});`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'String Concat',
            label: 'String Concat',
            category: { name: 'Function' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: 'string' },
                    { label: 'b', id: 'b', portType: 'value', dataType: 'string' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'string' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} + ${pContext.inputs['b'].value};`
            }
        }));
    }
}
