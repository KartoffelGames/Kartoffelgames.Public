import { PotatnoCodeFile } from '../../source/document/potatno-code-file.ts';
import { NodeCategory } from '../../source/node/node-category.enum.ts';
import { PotatnoCodeApplication } from '../../source/potatno-code-application.ts';
import type { PotatnoCodeFunction } from '../../source/project/potatno-code-function.ts';
import { PotatnoEntryPointDefinition } from "../../source/project/potatno-entry-point-definition.ts";
import { PotatnoNodeDefinition } from "../../source/project/potatno-node-definition.ts";
import { PotatnoProject } from '../../source/project/potatno-project.ts';

// --- Project configuration ---
const lProject = new PotatnoProject({
    commentToken: '//',
    types: {
        number: 0,
        string: '',
        boolean: false
    },
});

// --- Imports ---
lProject.addImport({
    name: 'Math',
    nodes: [
        PotatnoNodeDefinition.create(lProject, {
            id: 'Math.PI',
            category: NodeCategory.Value,
            inputs: {},
            outputs: {
                value: { nodeType: 'value', dataType: 'number' }
            } as const,
            codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = Math.PI;`,
            preview: {
                data: {
                    updatePreviewData: () => ({ value: Math.PI })
                }
            }
        }),
        PotatnoNodeDefinition.create(lProject, {
            id: 'Math.E',
            category: NodeCategory.Value,
            inputs: {},
            outputs: {
                value: { nodeType: 'value', dataType: 'number' }
            } as const,
            codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = Math.E;`,
            preview: {
                data: {
                    updatePreviewData: () => ({ value: Math.E })
                }
            }
        }),
        PotatnoNodeDefinition.create(lProject, {
            id: 'Math.abs',
            category: NodeCategory.Function,
            inputs: {
                value: { nodeType: 'value', dataType: 'number' }
            } as const,
            outputs: {
                result: { nodeType: 'value', dataType: 'number' }
            } as const,
            codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = Math.abs(${pContext.inputs.value.valueId});`,
            preview: {
                data: {
                    updatePreviewData: (pInputData) => ({ result: Math.abs(pInputData.value) })
                }
            }
        }),
        PotatnoNodeDefinition.create(lProject, {
            id: 'Math.floor',
            category: NodeCategory.Function,
            inputs: {
                value: { nodeType: 'value', dataType: 'number' }
            } as const,
            outputs: {
                result: { nodeType: 'value', dataType: 'number' }
            } as const,
            codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = Math.floor(${pContext.inputs.value.valueId});`,
            preview: {
                data: {
                    updatePreviewData: (pInputData) => ({ result: Math.floor(pInputData.value) })
                }
            }
        }),
        PotatnoNodeDefinition.create(lProject, {
            id: 'Math.random',
            category: NodeCategory.Function,
            inputs: {},
            outputs: {
                result: { nodeType: 'value', dataType: 'number' }
            } as const,
            codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = Math.random();`,
            preview: {
                data: {
                    updatePreviewData: () => ({ result: Math.random() })
                }
            }
        })
    ]
});

// --- Value Nodes ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Number Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: {
        value: { nodeType: 'input', inputType: 'number', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = ${pContext.outputs.value.value};`,
    preview: {
        data: {
            updatePreviewData: () => ({ value: 0 })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'String Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: {
        value: { nodeType: 'input', inputType: 'string', dataType: 'string' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = "${pContext.outputs.value.value}";`,
    preview: {
        data: {
            updatePreviewData: () => ({ value: '' })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Boolean Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: {
        value: { nodeType: 'input', inputType: 'boolean', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = ${pContext.outputs.value.value ? 'true' : 'false'};`,
    preview: {
        data: {
            updatePreviewData: () => ({ value: false })
        }
    }
}));

// --- Operator Nodes: Arithmetic ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Add',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} + ${pContext.inputs.b.valueId};`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ result: pInputData.a + pInputData.b })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Subtract',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} - ${pContext.inputs.b.valueId};`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ result: pInputData.a - pInputData.b })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Multiply',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} * ${pContext.inputs.b.valueId};`,
    preview: {
        element: {
            generatePreviewElement: (): HTMLCanvasElement => {
                const lCanvas: HTMLCanvasElement = document.createElement('canvas');
                lCanvas.width = 50;
                lCanvas.height = 50;
                lCanvas.style.cssText = 'width: 50px; height: 50px; image-rendering: pixelated; border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;';
                return lCanvas;
            },
            updatePreviewElement: (pCanvas: HTMLElement, _pInputData, pOutputData) => {
                const lCtx: CanvasRenderingContext2D | null = (pCanvas as HTMLCanvasElement).getContext('2d');
                if (!lCtx) {
                    return;
                }
                const lVal: number = Math.max(0, Math.min(255, Math.round((pOutputData.result as number) * 255)));
                lCtx.fillStyle = `rgb(${lVal}, ${lVal}, ${lVal})`;
                lCtx.fillRect(0, 0, 50, 50);
            }
        },
        data: {
            updatePreviewData: (pInputData) => ({ result: pInputData.a * pInputData.b })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Divide',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} / ${pContext.inputs.b.valueId};`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ result: pInputData.b !== 0 ? pInputData.a / pInputData.b : 0 })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Modulo',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} % ${pContext.inputs.b.valueId};`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ result: pInputData.b !== 0 ? pInputData.a % pInputData.b : 0 })
        }
    }
}));

// --- Operator Nodes: Comparison ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Equal',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} === ${pContext.inputs.b.valueId};`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ result: pInputData.a === pInputData.b })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Not Equal',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} !== ${pContext.inputs.b.valueId};`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ result: pInputData.a !== pInputData.b })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Less Than',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} < ${pContext.inputs.b.valueId};`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ result: pInputData.a < pInputData.b })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Greater Than',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} > ${pContext.inputs.b.valueId};`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ result: pInputData.a > pInputData.b })
        }
    }
}));

// --- Operator Nodes: Logic ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'And',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'boolean' },
        b: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} && ${pContext.inputs.b.valueId};`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ result: pInputData.a && pInputData.b })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Or',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'boolean' },
        b: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} || ${pContext.inputs.b.valueId};`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ result: pInputData.a || pInputData.b })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Not',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = !${pContext.inputs.a.valueId};`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ result: !pInputData.a })
        }
    }
}));

// --- Type Conversion Nodes ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Number to String',
    category: NodeCategory.TypeConversion,
    inputs: {
        input: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        output: { nodeType: 'value', dataType: 'string' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.output.valueId} = String(${pContext.inputs.input.valueId});`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ output: pInputData.input.toString() })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'String to Number',
    category: NodeCategory.TypeConversion,
    inputs: {
        input: { nodeType: 'value', dataType: 'string' }
    },
    outputs: {
        output: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.output.valueId} = Number(${pContext.inputs.input.valueId});`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ output: parseFloat(pInputData.input) || 0 })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Boolean to String',
    category: NodeCategory.TypeConversion,
    inputs: {
        input: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        output: { nodeType: 'value', dataType: 'string' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.output.valueId} = String(${pContext.inputs.input.valueId});`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({ output: pInputData.input.toString() })
        }
    }
}));

// --- Flow Nodes ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
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
    codeGenerator: (pContext) => `if (${pContext.inputs.condition.valueId}) {\n${pContext.outputs.then.code}\n} else {\n${pContext.outputs.else.code}\n}`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({
                then: pInputData.condition,
                else: !(pInputData.condition)
            })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'While',
    category: NodeCategory.Flow,
    inputs: {
        exec: { nodeType: 'flow' },
        condition: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        body: { nodeType: 'flow' }
    },
    codeGenerator: (pContext) => `while (${pContext.inputs.condition.valueId}) {\n${pContext.outputs.body.code}\n}`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({
                body: pInputData.condition
            })
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
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
    codeGenerator: (pContext) => `for (let ${pContext.outputs.index.valueId} = 0; ${pContext.outputs.index.valueId} < ${pContext.inputs.count.valueId}; ${pContext.outputs.index.valueId}++) {\n${pContext.outputs.exec.code}\n}`,
    preview: {
        data: {
            updatePreviewData: () => {
                return {
                    exec: true,
                    index: 0
                };
            }
        }
    }
}));

// --- Function Nodes ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Console Log',
    category: NodeCategory.Function,
    inputs: { message: { nodeType: 'value', dataType: 'string' } },
    outputs: {},
    codeGenerator: ({ inputs }) => `console.log(${inputs.message.valueId});`,
    preview: {
        data: {
            updatePreviewData: () => ({})
        }
    }
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'String Concat',
    category: NodeCategory.Function,
    inputs: {
        a: { nodeType: 'value', dataType: 'string' },
        b: { nodeType: 'value', dataType: 'string' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'string' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} + ${pContext.inputs.b.valueId};`,
    preview: {
        data: {
            updatePreviewData: (pInputData) => ({
                result: pInputData.a + pInputData.b
            })
        }
    }
}));

// --- Function Code Generator ---
lProject.setFunctionCodeGenerator((pFunc: PotatnoCodeFunction) => {
    const lParams: string = pFunc.inputs.map((i: { valueId: string; }) => i.valueId).join(', ');
    const lReturnStmt: string = pFunc.outputs.length > 0
        ? `\n    return ${pFunc.outputs[0].valueId};`
        : '';
    return `function ${pFunc.name}(${lParams}) {\n${pFunc.bodyCode}${lReturnStmt}\n}`;
});

// --- Entry Point: Pixel Shader ---
lProject.setEntryPoint(new PotatnoEntryPointDefinition(lProject, {
    id: 'pixelShader',
    label: 'Pixel Shader',
    statics: {
        imports: true,
        inputs: false,
        outputs: false
    },
    nodes: {
        static: [
            // OnPixel: provides normalized x/y coordinates (0-1 range)
            PotatnoNodeDefinition.create(lProject, {
                id: 'OnPixel',
                category: NodeCategory.Event,
                inputs: {},
                outputs: {
                    x: { nodeType: 'value', dataType: 'number' },
                    y: { nodeType: 'value', dataType: 'number' }
                } as const,
                codeGenerator: (pContext) => {
                    return `// Pixel coordinates\nconst ${pContext.outputs.x.valueId} = __pixel_x;\nconst ${pContext.outputs.y.valueId} = __pixel_y;`;
                },
                preview: {
                    data: {
                        updatePreviewData: (pInputData) => ({
                            x: (pInputData as any).x ?? 0,
                            y: (pInputData as any).y ?? 0
                        })
                    }
                }
            }),
            // PixelResult: receives RGB color values (0-1 range)
            PotatnoNodeDefinition.create(lProject, {
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
                },
                preview: {
                    data: {
                        updatePreviewData: () => ({})
                    }
                }
            })
        ]
    }
}));

// --- Preview (100x100 pixel canvas) ---
let lPreviewCanvas: HTMLCanvasElement;
let lPreviewCtx: CanvasRenderingContext2D;

lProject.setPreview(
    (pContainer: HTMLElement) => {
        lPreviewCanvas = document.createElement('canvas');
        lPreviewCanvas.width = 100;
        lPreviewCanvas.height = 100;
        lPreviewCanvas.style.cssText = 'width: 100px; height: 100px; image-rendering: pixelated; background: #000;';
        pContainer.appendChild(lPreviewCanvas);
        lPreviewCtx = lPreviewCanvas.getContext('2d')!;
    },
    (_pCode: string) => {
        // The canvas update is driven by the render loop via update(), not by code generation.
    }
);

// --- Create application and open an empty file ---
const lApp: PotatnoCodeApplication = new PotatnoCodeApplication(lProject);
lApp.appendTo(document.body);
lApp.file = new PotatnoCodeFile();

// --- Pixel shader render loop ---
function renderFrame(): void {
    if (!lPreviewCtx) {
        requestAnimationFrame(renderFrame);
        return;
    }

    const lImageData: ImageData = lPreviewCtx.createImageData(100, 100);

    for (let lY = 0; lY < 100; lY++) {
        for (let lX = 0; lX < 100; lX++) {
            // Evaluate the node graph with normalized pixel coordinates.
            const lResult = lApp.update(
                { 'OnPixel': { x: lX / 100, y: lY / 100 } },
                false // Don't update element previews during bulk iteration.
            );

            // Read PixelResult node's input data (the RGB values connected to it).
            let lRed = 0;
            let lGreen = 0;
            let lBlue = 0;

            if (lResult) {
                // Find the PixelResult node by its definition id.
                for (const [, lData] of lResult) {
                    // We check all nodes, but the PixelResult node's inputs contain the final color.
                    // The node is identified by looking for red/green/blue inputs.
                    if ('red' in lData.inputs && 'green' in lData.inputs && 'blue' in lData.inputs) {
                        lRed = lData.inputs['red'] as number;
                        lGreen = lData.inputs['green'] as number;
                        lBlue = lData.inputs['blue'] as number;
                        break;
                    }
                }
            }

            const lIdx: number = (lY * 100 + lX) * 4;
            lImageData.data[lIdx] = Math.max(0, Math.min(255, Math.round(lRed * 255)));
            lImageData.data[lIdx + 1] = Math.max(0, Math.min(255, Math.round(lGreen * 255)));
            lImageData.data[lIdx + 2] = Math.max(0, Math.min(255, Math.round(lBlue * 255)));
            lImageData.data[lIdx + 3] = 255;
        }
    }

    lPreviewCtx.putImageData(lImageData, 0, 0);

    // Update node element previews once per frame with center pixel data.
    lApp.update({ 'OnPixel': { x: 0.5, y: 0.5 } }, true);

    requestAnimationFrame(renderFrame);
}

renderFrame();
