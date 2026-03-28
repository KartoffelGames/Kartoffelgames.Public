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

// --- Imports (replaces defineGlobalValue) ---
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
            codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = Math.PI;`
        }),
        PotatnoNodeDefinition.create(lProject, {
            id: 'Math.E',
            category: NodeCategory.Value,
            inputs: {},
            outputs: {
                value: { nodeType: 'value', dataType: 'number' }
            } as const,
            codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = Math.E;`
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
            codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = Math.abs(${pContext.inputs.value.valueId});`
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
            codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = Math.floor(${pContext.inputs.value.valueId});`
        }),
        PotatnoNodeDefinition.create(lProject, {
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

// --- Global inputs/outputs ---
lProject.addGlobalInput({ name: 'time', type: 'number' });
lProject.addGlobalOutput({ name: 'result', type: 'string' });

// --- Value Nodes ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Number Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: {
        value: { nodeType: 'input', inputType: 'number', dataType: 'number' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = ${pContext.outputs.value.value};`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'String Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: {
        value: { nodeType: 'input', inputType: 'string', dataType: 'string' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = "${pContext.outputs.value.value}";`
}));

lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Boolean Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: {
        value: { nodeType: 'input', inputType: 'boolean', dataType: 'boolean' }
    },
    codeGenerator: (pContext) => `const ${pContext.outputs.value.valueId} = ${pContext.outputs.value.value ? 'true' : 'false'};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} + ${pContext.inputs.b.valueId};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} - ${pContext.inputs.b.valueId};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} * ${pContext.inputs.b.valueId};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} / ${pContext.inputs.b.valueId};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} % ${pContext.inputs.b.valueId};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} === ${pContext.inputs.b.valueId};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} !== ${pContext.inputs.b.valueId};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} < ${pContext.inputs.b.valueId};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} > ${pContext.inputs.b.valueId};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} && ${pContext.inputs.b.valueId};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = ${pContext.inputs.a.valueId} || ${pContext.inputs.b.valueId};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.result.valueId} = !${pContext.inputs.a.valueId};`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.output.valueId} = String(${pContext.inputs.input.valueId});`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.output.valueId} = Number(${pContext.inputs.input.valueId});`
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
    codeGenerator: (pContext) => `const ${pContext.outputs.output.valueId} = String(${pContext.inputs.input.valueId});`
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
    codeGenerator: (pContext) => `if (${pContext.inputs.condition.valueId}) {\n${pContext.outputs.then.code}\n} else {\n${pContext.outputs.else.code}\n}`
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
    codeGenerator: (pContext) => `while (${pContext.inputs.condition.valueId}) {\n${pContext.outputs.body.code}\n}`
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
    codeGenerator: (pContext) => `for (let ${pContext.outputs.index.valueId} = 0; ${pContext.outputs.index.valueId} < ${pContext.inputs.count.valueId}; ${pContext.outputs.index.valueId}++) {\n${pContext.outputs.exec.code}\n}`
}));

// --- Function Nodes (now with auto exec pins) ---
lProject.addNodeDefinition(PotatnoNodeDefinition.create(lProject, {
    id: 'Console Log',
    category: NodeCategory.Function,
    inputs: { message: { nodeType: 'value', dataType: 'string' } },
    outputs: {},
    codeGenerator: ({ inputs }) => `console.log(${inputs.message.valueId});`
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
            updatePreviewData: (pInputData) => {
                return {
                    result: pInputData.a + pInputData.b
                };
            }
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

// --- Main Functions ---
lProject.setEntryPoint(new PotatnoEntryPointDefinition(lProject, {
    id: 'main',
    label: 'Main',
    statics: {
        imports: true,
        inputs: true,
        outputs: true
    },
    nodes: {
        static: [
            PotatnoNodeDefinition.create(lProject, {
                id: 'OnStart',
                category: NodeCategory.Value,
                inputs: {},
                outputs: {
                    event: { nodeType: 'flow' }
                } as const,
                codeGenerator: (pContext) => {
                    return `onStart() {\n${pContext.outputs.event.code}\n}`;
                }
            }),
            PotatnoNodeDefinition.create(lProject, {
                id: 'OnTick',
                category: NodeCategory.Value,
                inputs: {},
                outputs: {
                    event: { nodeType: 'flow' },
                    deltaTime: { nodeType: 'value', dataType: 'number' }
                } as const,
                codeGenerator: (pContext) => {
                    return `onTick(${pContext.outputs.deltaTime.valueId}) {\n${pContext.outputs.event.code}\n}`;
                }
            })
        ]
    }
}));

// --- Preview (merged into single call) ---
let lPreviewPre: HTMLPreElement;

lProject.setPreview(
    (pContainer: HTMLElement) => {
        lPreviewPre = document.createElement('pre');
        lPreviewPre.style.cssText = 'color: #cdd6f4; margin: 0; padding: 8px; font-family: "Cascadia Code", "Fira Code", monospace; font-size: 13px; white-space: pre-wrap; word-break: break-all;';
        pContainer.appendChild(lPreviewPre);
    },
    (pCode: string) => {
        if (!lPreviewPre) {
            return;
        }

        try {
            const lWrappedCode: string = `
                const __logs = [];
                const console = { log: function() { __logs.push(Array.prototype.slice.call(arguments).map(String).join(' ')); } };
                ${pCode}
                if (typeof main === 'function') { main(); }
                return __logs;
            `;

            const lExecute: Function = new Function(lWrappedCode);
            const lResult: Array<string> = lExecute();
            if (lResult.length > 0) {
                lPreviewPre.textContent = lResult.join('\n');
                lPreviewPre.style.color = '#cdd6f4';
            } else {
                lPreviewPre.textContent = '(no output)';
                lPreviewPre.style.color = '#6c7086';
            }
        } catch (pError: any) {
            lPreviewPre.textContent = `Error: ${pError.message ?? pError}`;
            lPreviewPre.style.color = '#f38ba8';
        }
    }
);

// --- Create application and open an empty file ---
const lApp: PotatnoCodeApplication = new PotatnoCodeApplication(lProject);
lApp.appendTo(document.body);
lApp.file = new PotatnoCodeFile();
