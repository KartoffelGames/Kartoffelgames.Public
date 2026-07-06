import { PotatnoStaticNodeDefinition } from '../../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoProject } from '../../../source/project/potatno-project.ts';
import { PotatnoTestProjectCalculatorFunctionDefinition } from './potatno-test-project-calculator-function-definition.ts';
import { PotatnoTestProjectExtraComparisonImportDefinition } from './potatno-test-project-extra-comparison-import-definition.ts';
import { PotatnoTestProjectGlobalMultiplierVariable } from './potatno-test-project-global-multiplier-variable.ts';
import { PotatnoTestProjectHelperFunctionDefinition } from './potatno-test-project-helper-function-definition.ts';
import { PotatnoTestProjectTypesDefinition } from './potatno-test-project-types-definition.ts';

/**
 * Test project definition for the PotatnoCode test suite.
 */
export class PotatnoTestProject extends PotatnoProject<PotatnoTestProjectTypesDefinition> {
    private readonly mHelperFunction: PotatnoTestProjectHelperFunctionDefinition;

    /**
     * Get the dynamic helper function definition used by the test project.
     */
    public get helperFunction(): PotatnoTestProjectHelperFunctionDefinition {
        return this.mHelperFunction;
    }

    /**
     * Create the PotatnoCode test project definition.
     */
    public constructor() {
        const lProjectTypes = new PotatnoTestProjectTypesDefinition();
        const lMainFunction = new PotatnoTestProjectCalculatorFunctionDefinition();
        const lHelperFunction = new PotatnoTestProjectHelperFunctionDefinition();

        super(lProjectTypes, lMainFunction, {
            generator: {
                code: (pContext): string => {
                    let lCodeResult: string = '';

                    for (const lDependency of pContext.dependencies) {
                        lCodeResult += `${lDependency.code} `;
                    }

                    lCodeResult += pContext.entryPoint.code;

                    return lCodeResult;
                },
                values: {
                    hook: (pValueId: string): string => {
                        return `/*[${pValueId}]*/`;
                    },
                    valueId: (pValueIndex: number): string => {
                        return `v_${pValueIndex}`;
                    }
                }
            }
        });

        // Register function, base nodes and imports.
        this.mHelperFunction = lHelperFunction;
        this.setDynamicFunction(lHelperFunction);
        this.addBaseNodeDefinitions();
        this.addImport(new PotatnoTestProjectExtraComparisonImportDefinition());
    }

    /**
     * Register base node definitions.
     */
    private addBaseNodeDefinitions(): void {
        // Register flow pass-through nodes.
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Pass',
            label: 'Pass',
            category: { name: 'flow' },
            ports: {
                inputs: [
                    { label: 'exec', id: 'exec', portType: 'flow' }
                ],
                outputs: [
                    { label: 'exec', id: 'exec', portType: 'flow' }
                ]
            },
            generators: {
                code: (pContext): string => {
                    return `/* pass */; ${pContext.outputs['exec'].code.inner}`;
                }
            }
        }));

        // Register value nodes.
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Const',
            label: 'Const',
            category: { name: 'value' },
            ports: {
                inputs: [
                    { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['value'].value};`
            }
        }));

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
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} * ${pContext.inputs['b'].value};`
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
                code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} / ${pContext.inputs['b'].value};`
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
            id: 'Greater',
            label: 'Greater',
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
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Smaller',
            label: 'Smaller',
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

        // Register generic selector nodes.
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'Pick',
            label: 'Pick',
            category: { name: 'operator' },
            ports: {
                inputs: [
                    { label: 'a', id: 'a', portType: 'value', dataType: '<T>' },
                    { label: 'b', id: 'b', portType: 'value', dataType: '<T>' },
                    { label: 'condition', id: 'condition', portType: 'value', dataType: 'boolean' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: '<T>' }
                ]
            },
            generators: {
                code: (pContext): string => {
                    const lA: string = pContext.inputs['a'].value;
                    const lB: string = pContext.inputs['b'].value;
                    const lCondition: string = pContext.inputs['condition'].value;
                    const lResult: string = pContext.outputs['result'].value;
                    return `const ${lResult} = ((a, b, cond) => { if (cond) { return a; } return b; })(${lA}, ${lB}, ${lCondition});`;
                }
            }
        }));

        // Register parsing nodes.
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'NumberToString',
            label: 'toString',
            category: { name: 'parsing' },
            ports: {
                inputs: [
                    { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'string' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = String(${pContext.inputs['value'].value});`
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'ParseStringToNumber',
            label: 'parseString',
            category: { name: 'parsing' },
            ports: {
                inputs: [
                    { label: 'value', id: 'value', portType: 'value', dataType: 'string' }
                ],
                outputs: [
                    { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                ]
            },
            generators: {
                code: (pContext): string => `const ${pContext.outputs['result'].value} = Number(${pContext.inputs['value'].value});`
            }
        }));

        // Register branching and global nodes.
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
                code: (pContext): string => {
                    return `if (${pContext.inputs['condition'].value}) { ${pContext.outputs['then'].code.inner} } else { ${pContext.outputs['else'].code.inner} } ${pContext.code.next}`;
                }
            }
        }));
        this.addNodeDefinition(new PotatnoStaticNodeDefinition({
            id: 'GlobalMultiplier',
            label: 'global multiplier',
            category: { name: 'global' },
            ports: {
                inputs: [
                    { label: 'exec', id: 'exec', portType: 'flow' },
                    { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
                ],
                outputs: [
                    { label: 'exec', id: 'exec', portType: 'flow' }
                ]
            },
            generators: {
                code: (pContext): string => {
                    return `${PotatnoTestProjectGlobalMultiplierVariable} = ${pContext.inputs['value'].value}; ${pContext.outputs['exec'].code.inner}`;
                }
            }
        }));
    }
}
