import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { PotatnoCodeApplication } from '../../source/potatno-code-application.ts';
import { PotatnoPreviewDisplay } from "../../source/preview/potatno-preview-display.ts";
import { PotatnoPreviewFunctionExecutor } from "../../source/preview/potatno-preview-function-executor.ts";
import { PotatnoPreview } from "../../source/preview/potatno-preview.ts";
import { PotatnoNodeDefinition } from "../../source/project/node_definition/potatno-node-definition.ts";
import { PotatnoStaticNodeDefinition } from "../../source/project/node_definition/potatno-static-node-definition.ts";
import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from "../../source/project/potatno-function-definition.ts";
import { PotatnoProjectTypesDefinition } from "../../source/project/potatno-project-types-definition.ts";
import { PotatnoProject } from '../../source/project/potatno-project.ts';

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
            // OnPixel: provides normalized x/y coordinates (0-1 range) as the function's
            // parameters. Wraps every downstream node's code into an arrow-function body.
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
                        // x and y become the function parameters; the exec flow output's
                        // inner code is every node downstream of OnPixel, ending with
                        // PixelResult's `return [...]` statement.
                        const lX: string = pContext.outputs['x'].value;
                        const lY: string = pContext.outputs['y'].value;
                        return `(${lX}, ${lY}) => { ${pContext.outputs['exec'].code.inner} }`;
                    }
                }
            }));
        },
        exit: (pAddNode) => {
            // PixelResult: receives RGB and emits the function's `return [r, g, b];` statement.
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
                        return `return [${pContext.inputs["red"].value}, ${pContext.inputs["green"].value}, ${pContext.inputs["blue"].value}];`;
                    }
                }
            }));
        }
    },
    generator: {
        code: {
            body: (pResult) => {
                // Build the function declaration. Use the function's `definitionId` (an
                // identifier-safe slug) — `label` can contain spaces and would be invalid JS.
                const lGraph = pResult.graphResultOf('OnPixel');
                return `const ${pResult.function.definitionId} = ${lGraph?.code ?? '() => [0, 0, 0]'};`;
            },
            value: (pContext) => {
                // Call-site expression when this function is used as a node in another graph.
                // Not exercised by the function-level pixel-shader preview itself.
                return `${pContext.function.definitionId}()`;
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
                        // Wrap the downstream flow in an arrow function whose parameters are this
                        // entry node's value outputs (i.e. the function inputs).
                        const lParameters: string = Object.entries(pContext.outputs)
                            .filter(([lId]) => lId !== 'exec')
                            .map(([, lOutput]) => lOutput.value)
                            .join(', ');
                        return `(${lParameters}) => { ${pContext.outputs['exec'].code.inner} }`;
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
                        // Emit a single return of an object keyed by output label (this node's
                        // value inputs are the function outputs). Flow inputs are not in pContext.inputs.
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
            body: (pResult) => {
                // Declare the function as `const <fnName> = (params) => { ...; return {...}; };`.
                // The name is a JS-safe identifier derived from the function instance id so
                // multiple instances of the same definition never collide.
                const lFunctionName: string = `__fn_${pResult.function.id.replaceAll('-', '_')}`;
                const lGraph = pResult.graphResultOf('HelperFunctionEntry');
                return `const ${lFunctionName} = ${lGraph?.code ?? '() => ({})'};`;
            },
            value: (pContext) => {
                // Call site: invoke the function and destructure its returned object into the call
                // node's value outputs (keyed by output label). The trailing flow output continues
                // the surrounding graph.
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

/*
 * Define function executors for previews.
 */

// Resolution of the canvas preview surface. Iteration cost scales with width * height, so keep
// it small for the demo — 48x48 fills in a couple of milliseconds and gives a recognisable image.
const gPreviewWidth: number = 48;
const gPreviewHeight: number = 48;

/**
 * Shape of the compiled function-level callable: takes the pixel coords and returns an
 * `[r, g, b]` triple, each component in the `[0, 1]` range. Defined once so both the build
 * callback and the display loop reference the same contract.
 */
type PixelCallable = (pX: number, pY: number) => [number, number, number];

const lEntryFunctionExecutor = PotatnoPreviewFunctionExecutor.new(lProjectTypes, lEntryFunction, {
    parameters: { x: 0, y: 0 }, // Iteration-fed parameters; the display passes one of these per call.
    buildFunction: (pExecutor, pGeneratorResult) => {
        // Function-level path. `pGeneratorResult.code` is a full
        // `const pixelShader = (x, y) => {...};` declaration. Compile inside a wrapper and
        // grab the named function back out — its natural return is the `[r, g, b]` array.
        const lFunctionCode: string = pGeneratorResult.code;
        const lFunctionName: string = pExecutor.function.id;
        const lCompiled: PixelCallable = new Function(`${lFunctionCode}\nreturn ${lFunctionName};`)() as PixelCallable;

        return (pParameters: { x: number; y: number; }): [number, number, number] => {
            return lCompiled(pParameters.x, pParameters.y);
        };
    },
    buildNode: (pExecutor, pGeneratorResult, pPortTarget) => {
        // Per-node path. `pGeneratorResult.code` is the FULL function declaration (with deps):
        //   const pixelShader = (x, y) => { ...; /*[valueId]*/ ...; return [...]; };
        // so the input node already supplies the (x, y) interface and the previewed value is
        // computed in context. Replace the targeted output port's valueId hook with a `return`
        // so the function yields that intermediate value instead of its final result, then pull
        // the named function out and run it per pixel. Code after the injected return is dead.
        const lFunctionCode: string = pGeneratorResult.code;
        const lFunctionName: string = pExecutor.function.id;
        const lHookMarker: string = `/*[${pPortTarget.value}]*/`;
        const lInstrumented: string = lFunctionCode.includes(lHookMarker)
            ? lFunctionCode.replace(lHookMarker, `; return ${pPortTarget.value};`)
            : lFunctionCode;

        // The per-node callable yields the port's raw value. The driver wraps it with the
        // display's matching adapter, so the executor's return type stays honestly `unknown`.
        const lNodeFn: (pX: number, pY: number) => unknown = new Function(`${lInstrumented}\nreturn ${lFunctionName};`)() as (pX: number, pY: number) => unknown;
        return (pParameters: { x: number; y: number; }): unknown => {
            return lNodeFn(pParameters.x, pParameters.y);
        };
    }
});

/*
 * Define preview displays.
 */

const lCanvas2dPreviewDisplay = PotatnoPreviewDisplay.new(lProjectTypes, {
    id: '2dCanvas',
    expectedParameters: { x: 0, y: 0 },     // Must match lEntryFunctionExecutor.parameters at compile time.
    defaultResult: [0, 0, 0] as [number, number, number], // [r, g, b] in [0, 1] range; drives TResult inference.
    generate: (): HTMLCanvasElement => {
        // Off-DOM canvas — the preview panel re-parents this element into its content area.
        const lCanvas: HTMLCanvasElement = document.createElement('canvas');
        lCanvas.width = gPreviewWidth;
        lCanvas.height = gPreviewHeight;
        lCanvas.style.width = '100%';
        lCanvas.style.height = '100%';
        lCanvas.style.imageRendering = 'pixelated';
        return lCanvas;
    },
    typeAdapter: {
        'number': (pInputValue) => {
            // `pInputValue` is inferred as `number` from lProjectTypes.number.default.value.
            // Per-node previews evaluate a single number; this adapter widens that into a
            // grayscale RGB triple so the canvas can paint it uniformly.
            return [pInputValue, pInputValue, pInputValue];
        }
    },
    update: async (pElement, pExecutor) => {
        // pExecutor: (params) => [r, g, b] | Promise<[r, g, b]>, already adapter-wrapped for
        // per-node previews. The display owns the outer iteration loop.
        const lContext: CanvasRenderingContext2D | null = pElement.getContext('2d');
        if (!lContext) {
            return;
        }

        const lWidth: number = pElement.width;
        const lHeight: number = pElement.height;
        const lImageData: ImageData = lContext.createImageData(lWidth, lHeight);
        const lPixels: Uint8ClampedArray = lImageData.data;

        for (let lY = 0; lY < lHeight; lY++) {
            for (let lX = 0; lX < lWidth; lX++) {
                // Normalise to [0, 1] so the shader code can stay resolution-agnostic.
                const lNormalizedX: number = lX / lWidth;
                const lNormalizedY: number = lY / lHeight;
                const lRgb: [number, number, number] = await Promise.resolve(pExecutor({ x: lNormalizedX, y: lNormalizedY }));

                const lOffset: number = (lY * lWidth + lX) * 4;
                // Clamp each component, scale to 8-bit, and write RGBA. Out-of-range or NaN
                // values from the user's graph fall back to black so the preview never crashes.
                lPixels[lOffset] = Math.floor(Math.max(0, Math.min(1, lRgb[0] || 0)) * 255);
                lPixels[lOffset + 1] = Math.floor(Math.max(0, Math.min(1, lRgb[1] || 0)) * 255);
                lPixels[lOffset + 2] = Math.floor(Math.max(0, Math.min(1, lRgb[2] || 0)) * 255);
                lPixels[lOffset + 3] = 255;
            }
        }

        lContext.putImageData(lImageData, 0, 0);
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

            // Append dependency function declarations first so the entry point can call them.
            for (const lDependency of pContext.dependencies) {
                lCodeResult += `${lDependency.code}\n`;
            }

            // Then the entry point function declaration itself.
            lCodeResult += pContext.entryPoint.code;

            return lCodeResult;
        },
        values: {
            valueId: (pValueIndex: number) => {
                return `v_${pValueIndex}`;
            },
            hook: (pValueId: string) => {
                return `/*[${pValueId}]*/`;
            }
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
                code: (pContext) => `const ${pContext.outputs["value"].value} = Math.PI;`
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
                code: (pContext) => `const ${pContext.outputs["value"].value} = Math.E;`
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
                code: (pContext) => `const ${pContext.outputs["result"].value} = Math.abs(${pContext.inputs["value"].value});`
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
                code: (pContext) => `const ${pContext.outputs["result"].value} = Math.floor(${pContext.inputs["value"].value});`
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
                code: (pContext) => `const ${pContext.outputs["result"].value} = Math.random();`
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
        code: (pContext) => `const ${pContext.outputs["result"].value} = ${pContext.inputs["a"].value} + ${pContext.inputs["b"].value};`
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
        code: (pContext) => `const ${pContext.outputs["result"].value} = ${pContext.inputs["a"].value} - ${pContext.inputs["b"].value};`
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
            return `const ${pContext.outputs["result"].value} = ${pContext.inputs["a"].value} * ${pContext.inputs["b"].value};` +
                `/*MULTIPLYHOOK_${pContext.outputs["result"].value}*/`;
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
            return `const ${pContext.outputs["result"].value} = ${pContext.inputs["a"].value} / ${pContext.inputs["b"].value};`;
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
        code: (pContext) => `const ${pContext.outputs["result"].value} = ${pContext.inputs["a"].value} % ${pContext.inputs["b"].value};`
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
        code: (pContext) => `const ${pContext.outputs["result"].value} = ${pContext.inputs["a"].value} === ${pContext.inputs["b"].value};`
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
        code: (pContext) => `const ${pContext.outputs["result"].value} = ${pContext.inputs["a"].value} !== ${pContext.inputs["b"].value};`
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
        code: (pContext) => `const ${pContext.outputs["result"].value} = ${pContext.inputs["a"].value} < ${pContext.inputs["b"].value};`
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
        code: (pContext) => `const ${pContext.outputs["result"].value} = ${pContext.inputs["a"].value} > ${pContext.inputs["b"].value};`
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
        code: (pContext) => `const ${pContext.outputs["result"].value} = ${pContext.inputs["a"].value} && ${pContext.inputs["b"].value};`
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
        code: (pContext) => `const ${pContext.outputs["result"].value} = ${pContext.inputs["a"].value} || ${pContext.inputs["b"].value};`
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
        code: (pContext) => `const ${pContext.outputs["result"].value} = !${pContext.inputs["a"].value};`
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
        code: (pContext) => `const ${pContext.outputs["output"].value} = String(${pContext.inputs["input"].value});`
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
        code: (pContext) => `const ${pContext.outputs["output"].value} = Number(${pContext.inputs["input"].value});`
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
        code: (pContext) => `const ${pContext.outputs["output"].value} = String(${pContext.inputs["input"].value});`
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
        code: (pContext) => `if (${pContext.inputs["condition"].value}) {\n${pContext.outputs["then"].code.inner}\n} else {\n${pContext.outputs["else"].code.inner}\n}`
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
        code: (pContext) => `while (${pContext.inputs["condition"].value}) {\n${pContext.outputs["body"].code.inner}\n}`
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
        code: (pContext) => `for (let ${pContext.outputs["index"].value} = 0; ${pContext.outputs["index"].value} < ${pContext.inputs["count"].value}; ${pContext.outputs["index"].value}++) {\n${pContext.outputs["exec"].code.inner}\n}`
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
        code: ({ inputs }) => `console.log(${inputs["message"].value});`
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
        code: (pContext) => `const ${pContext.outputs["result"].value} = ${pContext.inputs["a"].value} + ${pContext.inputs["b"].value};`
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
