import { PotatnoCodeFile } from '../../source/document/potatno-code-file.ts';
import { NodeCategory } from '../../source/node/node-category.enum.ts';
import { PotatnoCodeApplication } from '../../source/potatno-code-application.ts';
import type { PotatnoCodeFunction } from '../../source/parser/potatno-code-function.ts';
import { PotatnoFunctionDefinition } from "../../source/project/potatno-function-definition.ts";
import { PotatnoNodeDefinition } from "../../source/project/potatno-node-definition.ts";
import { PotatnoProject, PotatnoProjectTypes } from '../../source/project/potatno-project.ts';

// --- Project configuration ---
const lProjectTypes = {
    number: 0,
    string: '',
    boolean: false
} satisfies PotatnoProjectTypes;

const lProject = new PotatnoProject({
    commentToken: '//',
    types: lProjectTypes,
    entryPoint: PotatnoFunctionDefinition.create({
        id: 'pixelShader',
        statics: {
            imports: true,
            inputs: true,
            outputs: false
        },
        nodes: {
            static: [
                // OnPixel: provides normalized x/y coordinates (0-1 range)
                PotatnoNodeDefinition.create({
                    id: 'OnPixel',
                    category: NodeCategory.Event,
                    inputs: {},
                    outputs: {
                        x: { nodeType: 'value', dataType: 'number' },
                        y: { nodeType: 'value', dataType: 'number' }
                    } as const,
                    codeGenerator: (pContext) => {
                        // Pixel coordinates
                        return `const ${pContext.outputs.x.valueId} = __pixel_x;\nconst ${pContext.outputs.y.valueId} = __pixel_y;`;
                    }
                }),
                // PixelResult: receives RGB color values (0-1 range)
                PotatnoNodeDefinition.create({
                    id: 'PixelResult',
                    category: NodeCategory.Output,
                    inputs: {
                        red: { nodeType: 'value', dataType: 'number' },
                        green: { nodeType: 'value', dataType: 'number' },
                        blue: { nodeType: 'value', dataType: 'number' }
                    } as const,
                    outputs: {},
                    codeGenerator: (pContext) => {
                        return `__pixel_r = ${pContext.inputs.red.valueId};\n__pixel_g = ${pContext.inputs.green.valueId};\n__pixel_b = ${pContext.inputs.blue.valueId};`;
                    }
                })
            ]
        },
        codeGenerator: (pFunction: PotatnoCodeFunction) => {
            const lInputParams: string = pFunction.inputs.map((i: { valueId: string; }) => i.valueId).join(', ');
            const lParams: string = lInputParams ? `__pixel_x, __pixel_y, ${lInputParams}` : '__pixel_x, __pixel_y';
            return `function ${pFunction.name}(${lParams}) {\nlet __pixel_r = 0, __pixel_g = 0, __pixel_b = 0;\n${pFunction.bodyCode}\nreturn [__pixel_r, __pixel_g, __pixel_b];\n}`;
        },
        preview: {
            generatePreview: (): HTMLCanvasElement => {
                const lPreviewCanvas: HTMLCanvasElement = document.createElement('canvas');
                lPreviewCanvas.width = 100;
                lPreviewCanvas.height = 100;
                lPreviewCanvas.style.cssText = 'width: 100px; height: 100px; image-rendering: pixelated; background: #000;';

                return lPreviewCanvas;
            },
            updatePreview: (pCanvas: HTMLCanvasElement, pFunction: PotatnoCodeFunction, _pPreviewInputData: {}, pCodeOutput: string) => {
                const lPreviewCtx: CanvasRenderingContext2D = pCanvas.getContext('2d')!;
                const lImageData: ImageData = lPreviewCtx.createImageData(pCanvas.width, pCanvas.height);

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
    })
});

// --- Imports ---
lProject.addImport({
    name: 'Math',
    nodes: [
        PotatnoNodeDefinition.create({
            id: 'Math.PI',
            category: NodeCategory.Value,
            inputs: {},
            outputs: {
                value: { nodeType: 'value', dataType: 'number' }
            } as const,
            codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = Math.PI;`
        }),
        PotatnoNodeDefinition.create({
            id: 'Math.E',
            category: NodeCategory.Value,
            inputs: {},
            outputs: {
                value: { nodeType: 'value', dataType: 'number' }
            } as const,
            codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = Math.E;`
        }),
        PotatnoNodeDefinition.create({
            id: 'Math.abs',
            category: NodeCategory.Function,
            inputs: {
                value: { nodeType: 'value', dataType: 'number' }
            } as const,
            outputs: {
                result: { nodeType: 'value', dataType: 'number' }
            } as const,
            codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = Math.abs(${pContext.inputs.value.valueId});`
        }),
        PotatnoNodeDefinition.create({
            id: 'Math.floor',
            category: NodeCategory.Function,
            inputs: {
                value: { nodeType: 'value', dataType: 'number' }
            } as const,
            outputs: {
                result: { nodeType: 'value', dataType: 'number' }
            } as const,
            codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = Math.floor(${pContext.inputs.value.valueId});`
        }),
        PotatnoNodeDefinition.create({
            id: 'Math.random',
            category: NodeCategory.Function,
            inputs: {},
            outputs: {
                result: { nodeType: 'value', dataType: 'number' }
            } as const,
            codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = Math.random();`
        })
    ]
});

// --- Value Nodes ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Number Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: {
        value: { nodeType: 'input', inputType: 'number', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = ${pContext.outputs.value.value};`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'String Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: {
        value: { nodeType: 'input', inputType: 'string', dataType: 'string' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = "${pContext.outputs.value.value}";`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Boolean Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: {
        value: { nodeType: 'input', inputType: 'boolean', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = ${pContext.outputs.value.value ? 'true' : 'false'};`
}));

// --- Operator Nodes: Arithmetic ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Add',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} + ${pContext.inputs.b.valueId};`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Subtract',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} - ${pContext.inputs.b.valueId};`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Multiply',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => {
        return `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} * ${pContext.inputs.b.valueId};` +
            `/*MULTIPLYHOOK_${pContext.outputs.result.valueId}*/`;
    },
    preview: {
        generatePreview: (): HTMLCanvasElement => {
            const lCanvas: HTMLCanvasElement = document.createElement('canvas');
            lCanvas.width = 50;
            lCanvas.height = 50;
            lCanvas.style.cssText = 'width: 50px; height: 50px; image-rendering: pixelated; border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;';
            return lCanvas;
        },
        updatePreview: (pCanvas: HTMLCanvasElement, pContext, pFunction: PotatnoCodeFunction, _pPreviewInputData: any, pIntermediateCodeOutput: string) => {
            const lPreviewCtx: CanvasRenderingContext2D = pCanvas.getContext('2d')!;
            const lImageData: ImageData = lPreviewCtx.createImageData(pCanvas.width, pCanvas.height);

            // Replace the last comment-hook with a return statement to get the result of the multiplication.
            const lCodeOutput: string = pIntermediateCodeOutput.replace(`/*MULTIPLYHOOK_${pContext.outputs.result.valueId}*/`, `return ${pContext.outputs.result.valueId};`);

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
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Divide',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => {
        return `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} / ${pContext.inputs.b.valueId};`;
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Modulo',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} % ${pContext.inputs.b.valueId};`
}));

// --- Operator Nodes: Comparison ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Equal',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} === ${pContext.inputs.b.valueId};`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Not Equal',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} !== ${pContext.inputs.b.valueId};`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Less Than',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} < ${pContext.inputs.b.valueId};`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Greater Than',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} > ${pContext.inputs.b.valueId};`
}));

// --- Operator Nodes: Logic ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'And',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'boolean' },
        b: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} && ${pContext.inputs.b.valueId};`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Or',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'boolean' },
        b: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} || ${pContext.inputs.b.valueId};`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Not',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = !${pContext.inputs.a.valueId};`
}));

// --- Type Conversion Nodes ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Number to String',
    category: NodeCategory.TypeConversion,
    inputs: {
        input: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        output: { nodeType: 'value', dataType: 'string' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.output.valueId} = String(${pContext.inputs.input.valueId});`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'String to Number',
    category: NodeCategory.TypeConversion,
    inputs: {
        input: { nodeType: 'value', dataType: 'string' }
    },
    outputs: {
        output: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.output.valueId} = Number(${pContext.inputs.input.valueId});`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Boolean to String',
    category: NodeCategory.TypeConversion,
    inputs: {
        input: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        output: { nodeType: 'value', dataType: 'string' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.output.valueId} = String(${pContext.inputs.input.valueId});`
}));

// --- Flow Nodes ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'If',
    category: NodeCategory.Flow,
    inputs: {
        exec: { nodeType: 'flow' },
        condition: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        then: { nodeType: 'flow' },
        else: { nodeType: 'flow' }
    },
    codeGenerator: (pContext) => `if (${pContext.inputs.condition.valueId}) {\n${pContext.outputs.then.code}\n} else {\n${pContext.outputs.else.code}\n}`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'While',
    category: NodeCategory.Flow,
    inputs: {
        exec: { nodeType: 'flow' },
        condition: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        body: { nodeType: 'flow' }
    },
    codeGenerator: (pContext) => `while (${pContext.inputs.condition.valueId}) {\n${pContext.outputs.body.code}\n}`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'For Loop',
    category: NodeCategory.Flow,
    inputs: {
        exec: { nodeType: 'flow' },
        count: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        exec: { nodeType: 'flow' },
        index: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => `for (let ${pContext.outputs.index.valueId} = 0; ${pContext.outputs.index.valueId} < ${pContext.inputs.count.valueId}; ${pContext.outputs.index.valueId}++) {\n${pContext.outputs.exec.code}\n}`
}));

// --- Function Nodes ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'Console Log',
    category: NodeCategory.Function,
    inputs: { message: { nodeType: 'value', dataType: 'string' } },
    outputs: {},
    codeGenerator: ({ inputs }) => `console.log(${inputs.message.valueId});`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create({
    id: 'String Concat',
    category: NodeCategory.Function,
    inputs: {
        a: { nodeType: 'value', dataType: 'string' },
        b: { nodeType: 'value', dataType: 'string' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'string' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} + ${pContext.inputs.b.valueId};`
}));

// --- Create application and open an empty file ---
const lApp: PotatnoCodeApplication = new PotatnoCodeApplication(lProject);
lApp.appendTo(document.body);
lApp.file = new PotatnoCodeFile();

// --- Pixel shader render loop ---
function renderFrame(): void {
    // Update node element previews once per frame with center pixel data.
    lApp.update({});

    requestAnimationFrame(renderFrame);
}

renderFrame();
