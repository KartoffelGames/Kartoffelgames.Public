import { PotatnoDocument } from '../../source/document/potatno-document.ts';
import { NodeCategory } from "../../source/parser/node/node-category.enum.ts";
import type { PotatnoCodeFunction } from '../../source/parser/potatno-code-function.ts';
import { PotatnoCodeApplication } from '../../source/potatno-code-application.ts';
import { PotatnoStaticNodeDefinition } from "../../source/project/node_definition/potatno-static-node-definition.ts";
import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from "../../source/project/potatno-function-definition.ts";
import { PotatnoProjectTypesDefinition } from "../../source/project/potatno-project-types-definition.ts";
import { PotatnoProject } from '../../source/project/potatno-project.ts';

/*
 // TODO:
 - Add a port list to PotatnoDocumentFunction that has a position where other ports can be redirected to. So the graph connection can be restructured without moving the nodes around.

 - [Advanced hehehe] Add a merge detection for flow ports that detects when a port with multiple connections oriented from the same node, so its code is not dublicated into the "if else" but can be added after it without dublication.
   As example for a simple if else node its generated code would be: {if: string, else: string, next: string} where the next part is the code that both branches share.
 */

// --- Project configuration ---
const lProjectTypes = PotatnoProjectTypesDefinition.new({
    number: {
        defaultValue: ['0'],
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
        defaultValue: [''],
        convert: (pValues: Array<string>) => {
            return pValues[0];
        },
        inputs: [
            { name: 'value', type: 'string' }
        ]
    },
    boolean: {
        defaultValue: ['false'],
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

const lProject = PotatnoProject.new({
    types: lProjectTypes,
    entryPoint: PotatnoFunctionDefinition.new(lProjectTypes, {
        id: 'pixelShader',
        label: 'Pixel Shader',
        statics: PotatnoFunctionDefinitionStatics.imports | PotatnoFunctionDefinitionStatics.inputs,
        nodes: {
            prefilled: (pAddNode) => {
                // OnPixel: provides normalized x/y coordinates (0-1 range)
                pAddNode(PotatnoStaticNodeDefinition.new({
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
                            // Pixel coordinates
                            return `const ${pContext.outputs["x"].valueId} = __pixel_x;\nconst ${pContext.outputs["y"].valueId} = __pixel_y;`;
                        }
                    }
                }));

                // PixelResult: receives RGB color values (0-1 range)
                pAddNode(PotatnoStaticNodeDefinition.new({
                    id: 'PixelResult',
                    label: 'PixelResult',
                    category: NodeCategory.Output,
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
                            return `__pixel_r = ${pContext.inputs["red"].valueId};\n__pixel_g = ${pContext.inputs["green"].valueId};\n__pixel_b = ${pContext.inputs["blue"].valueId};`;
                        }
                    }
                }));
            }
        },
        generator: {
            code: {
                body: (pFunction: PotatnoCodeFunction) => {
                    const lInputParams: string = pFunction.inputs["map"]((i: { valueId: string; }) => i.valueId).join(', ');
                    const lParams: string = lInputParams ? `__pixel_x, __pixel_y, ${lInputParams}` : '__pixel_x, __pixel_y';
                    return `function ${pFunction.name}(${lParams}) {\nlet __pixel_r = 0, __pixel_g = 0, __pixel_b = 0;\n${pFunction.bodyCode}\nreturn [__pixel_r, __pixel_g, __pixel_b];\n}`;
                },
                value: (pContext) => {
                    return `${pContext.inputs}`;
                }
            },
            preview: {
                generate: (): Element => {
                    const lPreviewCanvas: HTMLCanvasElement = document.createElement('canvas');
                    lPreviewCanvas.width = 100;
                    lPreviewCanvas.height = 100;
                    lPreviewCanvas.style.cssText = 'width: 100px; height: 100px; image-rendering: pixelated; background: #000;';

                    return lPreviewCanvas;
                },
                update: (pElement: Element, pFunction: PotatnoCodeFunction, _pPreviewInputData: {}, pCodeOutput: string) => {
                    const lCanvas: HTMLCanvasElement = pElement as HTMLCanvasElement;
                    const lPreviewCtx: CanvasRenderingContext2D = lCanvas.getContext('2d')!;
                    const lImageData: ImageData = lPreviewCtx.createImageData(lCanvas.width, lCanvas.height);

                    // Evaluate generated code to get the pixel shader function.
                    const lPixelShaderFunc = Function(pCodeOutput + '\nreturn ' + pFunction.name + ';')();

                    for (let lY = 0; lY < lImageData.height; lY++) {
                        for (let lX = 0; lX < lImageData.width; lX++) {
                            // Evaluate the node graph with normalized pixel coordinates.
                            const lResult: [red: number, green: number, blue: number] = lPixelShaderFunc(lX / lImageData.width, lY / lImageData.height);

                            const lIdx: number = (lY * lImageData.width + lX) * 4;
                            lImageData.data[lIdx] = Math.max(0, Math.min(255, Math.round(lResult[0] * 255)));
                            lImageData.data[lIdx + 1] = Math.max(0, Math.min(255, Math.round(lResult[1] * 255)));
                            lImageData.data[lIdx + 2] = Math.max(0, Math.min(255, Math.round(lResult[2] * 255)));
                            lImageData.data[lIdx + 3] = 255;
                        }
                    }

                    lPreviewCtx.putImageData(lImageData, 0, 0);
                }
            }
        },
    })
});

// --- Imports ---
lProject.addImport({
    id: 'Math',
    label: 'Math',
    nodes: [
        PotatnoStaticNodeDefinition.new({
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
        PotatnoStaticNodeDefinition.new({
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
        PotatnoStaticNodeDefinition.new({
            id: 'Math.abs',
            label: 'Math.abs',
            category: NodeCategory.Function,
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
        PotatnoStaticNodeDefinition.new({
            id: 'Math.floor',
            label: 'Math.floor',
            category: NodeCategory.Function,
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
        PotatnoStaticNodeDefinition.new({
            id: 'Math.random',
            label: 'Math.random',
            category: NodeCategory.Function,
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
lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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
        },
        preview: {
            generate: (): HTMLCanvasElement => {
                const lCanvas: HTMLCanvasElement = document.createElement('canvas');
                lCanvas.width = 50;
                lCanvas.height = 50;
                lCanvas.style.cssText = 'width: 50px; height: 50px; image-rendering: pixelated; border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;';
                return lCanvas;
            },
            update: (pPreviewElement: Element, pContext, pFunction: PotatnoCodeFunction, _pPreviewInputData: any, pIntermediateCodeOutput: string) => {
                const lCanvas: HTMLCanvasElement = pPreviewElement as HTMLCanvasElement;
                const lPreviewCtx: CanvasRenderingContext2D = lCanvas.getContext('2d')!;
                const lImageData: ImageData = lPreviewCtx.createImageData(lCanvas.width, lCanvas.height);

                // Replace the last comment-hook with a return statement to get the result of the multiplication.
                const lCodeOutput: string = pIntermediateCodeOutput.replace(`/*MULTIPLYHOOK_${pContext.outputs["result"].valueId}*/`, `return ${pContext.outputs["result"].valueId};`);

                // Evaluate generated code to get the pixel shader function.
                const lPixelShaderFunc = Function(lCodeOutput + '\nreturn ' + pFunction.name + ';')();

                for (let lY = 0; lY < lImageData.height; lY++) {
                    for (let lX = 0; lX < lImageData.width; lX++) {
                        // Evaluate the node graph with normalized pixel coordinates — result is a single number.
                        const lValue: number = lPixelShaderFunc(lX / lImageData.width, lY / lImageData.height);

                        const lIdx: number = (lY * lImageData.width + lX) * 4;
                        lImageData.data[lIdx] = Math.max(0, Math.min(255, Math.round(lValue * 255)));
                        lImageData.data[lIdx + 1] = Math.max(0, Math.min(255, Math.round(lValue * 255)));
                        lImageData.data[lIdx + 2] = Math.max(0, Math.min(255, Math.round(lValue * 255)));
                        lImageData.data[lIdx + 3] = 255;
                    }
                }

                lPreviewCtx.putImageData(lImageData, 0, 0);
            }
        }
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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
lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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
lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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
lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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
lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
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
lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
    id: 'Console Log',
    label: 'Console Log',
    category: NodeCategory.Function,
    ports: {
        inputs: [{ label: 'message', id: 'message', portType: 'value', dataType: 'string' }],
        outputs: []
    },
    generators: {
        code: ({ inputs }) => `console.log(${inputs["message"].valueId});`
    }
}));

lProject.addNodeDefinition(PotatnoStaticNodeDefinition.new({
    id: 'String Concat',
    label: 'String Concat',
    category: NodeCategory.Function,
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

// --- User Function Definitions ---
lProject.addUserFunction(PotatnoFunctionDefinition.new(lProjectTypes, {
    id: 'Helper Function',
    label: 'Helper Function',
    statics: PotatnoFunctionDefinitionStatics.none,
    nodes: {},
    generator: {
        code: {
            body: (pFunction: PotatnoCodeFunction) => {
                const lParams: string = pFunction.inputs["map"]((i: { name: string; valueId: string; }) => i.valueId).join(', ');
                const lReturnValues: string = pFunction.outputs["map"]((o: { valueId: string; }) => o.valueId).join(', ');
                let lBody: string = pFunction.bodyCode;
                if (lReturnValues) {
                    lBody += `\nreturn ${pFunction.outputs["length"] > 1 ? `[${lReturnValues}]` : lReturnValues};`;
                }
                return `function ${pFunction.name}(${lParams}) {\n${lBody}\n}`;
            },
            value: (pContext) => {
                const lArgs: string = Object.values(pContext.inputs).map((i: any) => i.valueId).join(', ');
                const lResultId: string = Object.values(pContext.outputs).map((o: any) => o.valueId)[0] ?? '_unused';
                return `const ${lResultId} = ${pContext.inputs}(${lArgs});`;
            }
        }
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
