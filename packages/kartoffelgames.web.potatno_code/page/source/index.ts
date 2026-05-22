import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { PotatnoCodeApplication } from '../../source/potatno-code-application.ts';
import { PotatnoNodeDefinition } from "../../source/project/node_definition/potatno-node-definition.ts";
import { PotatnoStaticNodeDefinition } from "../../source/project/node_definition/potatno-static-node-definition.ts";
import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from "../../source/project/potatno-function-definition.ts";
import { PotatnoProjectTypesDefinition } from "../../source/project/potatno-project-types-definition.ts";
import { PotatnoProject } from '../../source/project/potatno-project.ts';
import { PotatnoPreview } from "../../source/ui/component/potatno_preview/potatno-preview.ts";

/*
 // TODO:
 - Add the regions to the code generation context.
 - [Advanced hehehe] Add a merge detection for flow ports that detects when a port with multiple connections oriented from the same node, so its code is not dublicated into the "if else" but can be added after it without dublication.
   As example for a simple if else node its generated code would be: {if: string, else: string, next: string} where the next part is the code that both branches share.
 */

/*
 * Define Project types. 
 */
const lProjectTypes = PotatnoProjectTypesDefinition.new({
    number: {
        default: {
            string: ['0'],
            value: 0
        },
        convert: (pValues: Array<string>) => {
            const lNumberString: string = pValues[0];
            const lNumber: number = parseFloat(lNumberString);
            if (isNaN(lNumber)) {
                throw new Error(`Invalid number: "${lNumberString}"`);
            }
            return lNumber.toString();
        },
        inputs: [
            { name: 'value', type: 'number' }
        ]
    },
    string: {
        default: {
            string: [''],
            value: ''
        },
        convert: (pValues: Array<string>) => {
            return pValues[0];
        },
        inputs: [
            { name: 'value', type: 'string' }
        ]
    },
    boolean: {
        default: {
            string: ['false'],
            value: false
        },
        convert: (pValues: Array<string>) => {
            const lBooleanString: string = pValues[0].toLowerCase();
            if (lBooleanString === 'true') {
                return 'true';
            } else if (lBooleanString === 'false') {
                return 'false';
            } else {
                throw new Error(`Invalid boolean: "${pValues[0]}"`);
            }
        },
        inputs: [
            { name: 'value', type: 'boolean' }
        ]
    }
});

/*
 * Define project functions. 
 */
const lEntryFunction = PotatnoFunctionDefinition.new(lProjectTypes, {
    id: 'pixelShader',
    label: 'Pixel Shader',
    statics: PotatnoFunctionDefinitionStatics.imports | PotatnoFunctionDefinitionStatics.inputs,
    nodes: {
        entry: (pAddNode) => {
            // OnPixel: provides normalized x/y coordinates (0-1 range)
            pAddNode(PotatnoStaticNodeDefinition.newStaticNode({
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
                    code: (pContext) => {
                        // Create function head.
                        const lParameterNames = [
                            pContext.inputs["red"].valueId,
                            pContext.inputs["green"].valueId,
                            pContext.inputs["blue"].valueId
                        ];

                        const lParameters = lParameterNames.join(', ');

                        return `(${lParameters}) => { ${pContext.outputs['exec'].code.inner} ${pContext.code} }`;
                    }
                }
            }));
        },
        exit: (pAddNode) => {
            // PixelResult: receives RGB color values (0-1 range)
            pAddNode(PotatnoStaticNodeDefinition.newStaticNode({
                id: 'PixelResult',
                label: 'PixelResult',
                category: "Output",
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
                    code: (pContext) => {
                        // Create function head.
                        const lParameterNames = [
                            pContext.inputs["red"].valueId,
                            pContext.inputs["green"].valueId,
                            pContext.inputs["blue"].valueId
                        ];

                        return `{red: ${pContext.inputs["red"].valueId}, green: ${pContext.inputs["green"].valueId}, blue: ${pContext.inputs["blue"].valueId}}`;
                    }
                }
            }));
        }
    },
    generator: {
        code: {
            body: (pResult) => {
                // Look up the OnPixel graph by its entry-definition id.
                // The base result class exposes graphResultOf uniformly across FunctionResult and GraphResult.
                const lGraph = pResult.graphResultOf('OnPixel');

                return `const ${pResult.function.label} = ${lGraph?.code ?? ''}`;
            },
            value: (pContext) => {
                return `${pContext.inputs}`;
            }
        }
    },
});

const lUserFunction = PotatnoFunctionDefinition.new(lProjectTypes, {
    id: 'Helper Function',
    label: 'Helper Function',
    statics: PotatnoFunctionDefinitionStatics.none,
    nodes: {
        entry: (pAddNode, pFunction) => {
            // HelperFunctionEntry: provides entry point for the helper function
            pAddNode(PotatnoNodeDefinition.newNode({
                id: 'HelperFunctionEntry',
                label: 'Entry',
                category: 'event',
                generators: {
                    ports: {
                        outputs: (pAddPort) => {
                            // Add single execution output port.
                            pAddPort({ label: 'exec', id: 'exec', portType: 'flow' });

                            // Add all function outputs as ports on the entry node.
                            for (const output of pFunction.inputs) {
                                pAddPort({ label: output.label, id: output.label, portType: 'value', dataType: output.dataType });
                            }
                        },
                        inputs: () => { }
                    },
                    code: (pContext) => {
                        // Pixel coordinates
                        return `const ${pContext.outputs["x"].valueId} = __pixel_x;\nconst ${pContext.outputs["y"].valueId} = __pixel_y;`;
                    }
                }
            }));
        },
        exit: (pAddNode, pFunction) => {
            // HelperFunctionReturn: provides exit point for the helper function
            pAddNode(PotatnoNodeDefinition.newNode({
                id: 'HelperFunctionReturn',
                label: 'Return',
                category: 'event',
                generators: {
                    ports: {
                        outputs: () => { },
                        inputs: (pAddPort) => {
                            // Add single execution output port.
                            pAddPort({ label: 'exec', id: 'exec', portType: 'flow' });

                            // Add all function outputs as ports on the return node.
                            for (const output of pFunction.outputs) {
                                pAddPort({ label: output.label, id: output.label, portType: 'value', dataType: output.dataType });
                            }
                        }
                    },
                    code: (pContext) => {
                        // Create function head.
                        const lParameters = Object.values(pContext.inputs).map((pValue) => {
                            return pValue.valueId;
                        }).join(', ');

                        return `(${lParameters}) => { ${pContext.outputs['exec'].code.inner} ${pContext.code} }`;
                    }
                }
            }));
        }
    },
    generator: {
        code: {
            body: (pResult) => {
                // Look up the HelperFunctionEntry graph. The graph's entryPorts
                // give the parameter list and the exitPorts give the return values.
                const lGraph = pResult.graphResultOf('HelperFunctionEntry');

                return `const ${pResult.function.label} = ${lGraph?.code ?? ''}`;
            },
            value: (pContext) => {
                const lArgs: string = Object.values(pContext.inputs).map((i: any) => i.valueId).join(', ');
                const lResultId: string = Object.values(pContext.outputs).map((o: any) => o.valueId)[0] ?? '_unused';
                return `const ${lResultId} = ${pContext.inputs}(${lArgs});`;
            }
        }
    }
});

/*
 * Define function executors for previews. 
 */
const lEntryFunctionExecutor = PotatnoPreviewFunctionExecutor.new(lEntryFunction, {

});

/*
 * Define preview displays. 
 */

const lCanvas2dPreviewDisplay = PotatnoPreviewDisplay.new({
    id: '2dCanvas',
    defaultResult: [0, 0, 0], // This defined the required result for type adapter. 
    generate: (): HTMLCanvasElement => { // The Element is generic too so the update and generate functions can work with the correct type without the need of type assertions.
        return document.createElement('canvas');// TODO: Actual element
    },
    typeAdapter: { // Gets created from a class instance internally `PotatnoPreviewTypeAdapter`.
        'number': (pInputValue) => { // pInputValue-Type is infered from the PotatnoProjectTypesDefinition type. 
            // Convert value to vec3 (rgb)
            return [pInputValue, pInputValue, pInputValue];
        }
    },
    update: (pElement: HTMLCanvasElement, pDriver) => { // The driver contains the PotatnoPreviewTypeAdapter and automaticly converts the function output to the required type for the display.

    }
});

/*
 * Define previews for nodes and functions.
 */

const lProjectPreviews = PotatnoPreview.new(lProjectTypes);
lProjectPreviews.addDisplay(lCanvas2dPreviewDisplay, lEntryFunctionExecutor);


/*
 * Project configuration. 
 */

const lProject = PotatnoProject.new({
    types: lProjectTypes,
    previews: lProjectPreviews,
    functions: {
        entry: lEntryFunction,
        dynamic: [lUserFunction]
    },
    generator: {
        code: (pContext) => {
            let lCodeResult: string = '';

            // Append dependecies first.
            for (const lDependency of pContext.dependencies) {
                lCodeResult += `${lDependency.code}\n`;
            }

            return lCodeResult;
        },
        hook: (pValueId: string) => {
            return `/*[${pValueId}]*/`;
        }
    }
});

// --- Imports ---
lProject.addImport({ // TODO: Also create a PotatnoImportDefinition. The document knows what imports are used and can dynamicly add them to the nodeDefinitions property result.
    id: 'Math',
    label: 'Math',
    nodes: [
        PotatnoStaticNodeDefinition.newStaticNode({
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
                code: (pContext) => `const ${pContext.outputs["value"].valueId} = Math.PI;`
            }
        }),
        PotatnoStaticNodeDefinition.newStaticNode({
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
                code: (pContext) => `const ${pContext.outputs["value"].valueId} = Math.E;`
            }
        }),
        PotatnoStaticNodeDefinition.newStaticNode({
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
                code: (pContext) => `const ${pContext.outputs["result"].valueId} = Math.abs(${pContext.inputs["value"].valueId});`
            }
        }),
        PotatnoStaticNodeDefinition.newStaticNode({
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
                code: (pContext) => `const ${pContext.outputs["result"].valueId} = Math.floor(${pContext.inputs["value"].valueId});`
            }
        }),
        PotatnoStaticNodeDefinition.newStaticNode({
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
                code: (pContext) => `const ${pContext.outputs["result"].valueId} = Math.random();`
            }
        })
    ]
});

// --- Operator Nodes: Arithmetic ---
lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Add',
    label: 'Add',
    category: 'operator',
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
        code: (pContext) => `const ${pContext.outputs["result"].valueId} = ${pContext.inputs["a"].valueId} + ${pContext.inputs["b"].valueId};`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Subtract',
    label: 'Subtract',
    category: 'operator',
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
        code: (pContext) => `const ${pContext.outputs["result"].valueId} = ${pContext.inputs["a"].valueId} - ${pContext.inputs["b"].valueId};`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Multiply',
    label: 'Multiply',
    category: 'operator',
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
        code: (pContext) => {
            return `const ${pContext.outputs["result"].valueId} = ${pContext.inputs["a"].valueId} * ${pContext.inputs["b"].valueId};` +
                `/*MULTIPLYHOOK_${pContext.outputs["result"].valueId}*/`;
        }
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Divide',
    label: 'Divide',
    category: 'operator',
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
        code: (pContext) => {
            return `const ${pContext.outputs["result"].valueId} = ${pContext.inputs["a"].valueId} / ${pContext.inputs["b"].valueId};`;
        }
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Modulo',
    label: 'Modulo',
    category: 'operator',
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
        code: (pContext) => `const ${pContext.outputs["result"].valueId} = ${pContext.inputs["a"].valueId} % ${pContext.inputs["b"].valueId};`
    }
}));

// --- Operator Nodes: Comparison ---
lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Equal',
    label: 'Equal',
    category: 'operator',
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
        code: (pContext) => `const ${pContext.outputs["result"].valueId} = ${pContext.inputs["a"].valueId} === ${pContext.inputs["b"].valueId};`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Not Equal',
    label: 'Not Equal',
    category: 'operator',
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
        code: (pContext) => `const ${pContext.outputs["result"].valueId} = ${pContext.inputs["a"].valueId} !== ${pContext.inputs["b"].valueId};`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Less Than',
    label: 'Less Than',
    category: 'operator',
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
        code: (pContext) => `const ${pContext.outputs["result"].valueId} = ${pContext.inputs["a"].valueId} < ${pContext.inputs["b"].valueId};`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Greater Than',
    label: 'Greater Than',
    category: 'operator',
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
        code: (pContext) => `const ${pContext.outputs["result"].valueId} = ${pContext.inputs["a"].valueId} > ${pContext.inputs["b"].valueId};`
    }
}));

// --- Operator Nodes: Logic ---
lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'And',
    label: 'And',
    category: 'operator',
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
        code: (pContext) => `const ${pContext.outputs["result"].valueId} = ${pContext.inputs["a"].valueId} && ${pContext.inputs["b"].valueId};`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Or',
    label: 'Or',
    category: 'operator',
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
        code: (pContext) => `const ${pContext.outputs["result"].valueId} = ${pContext.inputs["a"].valueId} || ${pContext.inputs["b"].valueId};`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Not',
    label: 'Not',
    category: 'operator',
    ports: {
        inputs: [
            { label: 'a', id: 'a', portType: 'value', dataType: 'boolean' }
        ],
        outputs: [
            { label: 'result', id: 'result', portType: 'value', dataType: 'boolean' }
        ]
    },
    generators: {
        code: (pContext) => `const ${pContext.outputs["result"].valueId} = !${pContext.inputs["a"].valueId};`
    }
}));

// --- Type Conversion Nodes ---
lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Number to String',
    label: 'Number to String',
    category: 'type-conversion',
    ports: {
        inputs: [
            { label: 'input', id: 'input', portType: 'value', dataType: 'number' }
        ],
        outputs: [
            { label: 'output', id: 'output', portType: 'value', dataType: 'string' }
        ]
    },
    generators: {
        code: (pContext) => `const ${pContext.outputs["output"].valueId} = String(${pContext.inputs["input"].valueId});`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'String to Number',
    label: 'String to Number',
    category: 'type-conversion',
    ports: {
        inputs: [
            { label: 'input', id: 'input', portType: 'value', dataType: 'string' }
        ],
        outputs: [
            { label: 'output', id: 'output', portType: 'value', dataType: 'number' }
        ]
    },
    generators: {
        code: (pContext) => `const ${pContext.outputs["output"].valueId} = Number(${pContext.inputs["input"].valueId});`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Boolean to String',
    label: 'Boolean to String',
    category: 'type-conversion',
    ports: {
        inputs: [
            { label: 'input', id: 'input', portType: 'value', dataType: 'boolean' }
        ],
        outputs: [
            { label: 'output', id: 'output', portType: 'value', dataType: 'string' }
        ]
    },
    generators: {
        code: (pContext) => `const ${pContext.outputs["output"].valueId} = String(${pContext.inputs["input"].valueId});`
    }
}));

// --- Flow Nodes ---
lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'If',
    label: 'If',
    category: 'flow',
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
        code: (pContext) => `if (${pContext.inputs["condition"].valueId}) {\n${pContext.outputs["then"].code.inner}\n} else {\n${pContext.outputs["else"].code.inner}\n}`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'While',
    label: 'While',
    category: 'flow',
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
        code: (pContext) => `while (${pContext.inputs["condition"].valueId}) {\n${pContext.outputs["body"].code.inner}\n}`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'For Loop',
    label: 'For Loop',
    category: 'flow',
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
        code: (pContext) => `for (let ${pContext.outputs["index"].valueId} = 0; ${pContext.outputs["index"].valueId} < ${pContext.inputs["count"].valueId}; ${pContext.outputs["index"].valueId}++) {\n${pContext.outputs["exec"].code.inner}\n}`
    }
}));

// --- Function Nodes ---
lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'Console Log',
    label: 'Console Log',
    category: 'Function',
    ports: {
        inputs: [{ label: 'message', id: 'message', portType: 'value', dataType: 'string' }],
        outputs: []
    },
    generators: {
        code: ({ inputs }) => `console.log(${inputs["message"].valueId});`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.newStaticNode({
    id: 'String Concat',
    label: 'String Concat',
    category: 'Function',
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
        code: (pContext) => `const ${pContext.outputs["result"].valueId} = ${pContext.inputs["a"].valueId} + ${pContext.inputs["b"].valueId};`
    }
}));

// --- Create application and open an empty file ---
const lApp = new PotatnoCodeApplication(lProject);
lApp.appendTo(document.body);
lApp.document = new PotatnoDocument(lProject);

// --- Pixel shader render loop ---
function renderFrame(): void {
    // Update node element previews once per frame with center pixel data.
    lApp.update();

    requestAnimationFrame(renderFrame);
}

renderFrame();
