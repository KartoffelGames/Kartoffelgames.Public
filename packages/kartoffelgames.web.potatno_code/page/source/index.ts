import { PotatnoCodeFile } from '../../source/document/potatno-code-file.ts';
import { NodeCategory } from '../../source/node/node-category.enum.ts';
import { PotatnoCodeApplication } from '../../source/potatno-code-application.ts';
import type { PotatnoCodeFunction } from '../../source/project/potatno-code-function.ts';
import { PotatnoProjectNodeDefinition } from "../../source/project/potatno-node-definition.ts";
import { PotatnoProject } from '../../source/project/potatno-project.ts';

// --- Project configuration ---
const lProject: PotatnoProject = new PotatnoProject();

// --- Comment token ---
lProject.setCommentToken('//');

// --- Imports (replaces defineGlobalValue) ---
lProject.addImport({
    name: 'Math',
    nodes: [
        new PotatnoProjectNodeDefinition(lProject, {
            name: 'Math.PI',
            category: NodeCategory.Value,
            inputs: {},
            outputs: {
                value: { nodeType: 'value', dataType: 'number' }
            },
            codeGenerator: ({ outputs }) => `const ${outputs.value} = Math.PI;`
        }),
        new PotatnoProjectNodeDefinition(lProject, {
            name: 'Math.E',
            category: NodeCategory.Value,
            inputs: {},
            outputs: {
                value: { nodeType: 'value', dataType: 'number' }
            },
            codeGenerator: ({ outputs }) => `const ${outputs.value} = Math.E;`
        }),
        new PotatnoProjectNodeDefinition(lProject, {
            name: 'Math.abs',
            category: NodeCategory.Function,
            inputs: {
                value: { nodeType: 'value', dataType: 'number' }
            },
            outputs: {
                result: { nodeType: 'value', dataType: 'number' }
            },
            codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = Math.abs(${inputs.value});`
        }),
        new PotatnoProjectNodeDefinition(lProject, {
            name: 'Math.floor',
            category: NodeCategory.Function,
            inputs: {
                value: { nodeType: 'value', dataType: 'number' }
            },
            outputs: {
                result: { nodeType: 'value', dataType: 'number' }
            },
            codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = Math.floor(${inputs.value});`
        }),
        new PotatnoProjectNodeDefinition(lProject, {
            name: 'Math.random',
            category: NodeCategory.Function,
            inputs: {},
            outputs: {
                result: { nodeType: 'value', dataType: 'number' }
            },
            codeGenerator: ({ outputs }) => `const ${outputs.result} = Math.random();`
        })
    ]
});

// --- Global inputs/outputs ---
lProject.addGlobalInput({ name: 'time', type: 'number' });
lProject.addGlobalOutput({ name: 'result', type: 'string' });

// --- Value Nodes ---
lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Number Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: {
        value: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: ({ outputs, properties }) => `const ${outputs.value} = ${properties.value};`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'String Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: { value: { nodeType: 'value', dataType: 'string' } },
    codeGenerator: ({ outputs, properties }) => `const ${outputs.value} = "${properties.value}";`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Boolean Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: { value: { nodeType: 'value', dataType: 'boolean' } },
    codeGenerator: ({ outputs, properties }) => `const ${outputs.value} = ${properties.value};`
}));

// --- Operator Nodes: Arithmetic ---
lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Add',
    category: NodeCategory.Operator,
    inputs: { a: { nodeType: 'value', dataType: 'number' }, b: { nodeType: 'value', dataType: 'number' } },
    outputs: { result: { nodeType: 'value', dataType: 'number' } },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} + ${inputs.b};`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Subtract',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} - ${inputs.b};`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Multiply',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} * ${inputs.b};`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Divide',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} / ${inputs.b};`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Modulo',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} % ${inputs.b};`
}));

// --- Operator Nodes: Comparison ---
lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Equal',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} === ${inputs.b};`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Not Equal',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} !== ${inputs.b};`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Less Than',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} < ${inputs.b};`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Greater Than',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'number' },
        b: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} > ${inputs.b};`
}));

// --- Operator Nodes: Logic ---
lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'And',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'boolean' },
        b: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} && ${inputs.b};`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Or',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'boolean' },
        b: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} || ${inputs.b};`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Not',
    category: NodeCategory.Operator,
    inputs: {
        a: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        result: { nodeType: 'value', dataType: 'boolean' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = !${inputs.a};`
}));

// --- Type Conversion Nodes ---
lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Number to String',
    category: NodeCategory.TypeConversion,
    inputs: {
        input: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        output: { nodeType: 'value', dataType: 'string' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.output} = String(${inputs.input});`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'String to Number',
    category: NodeCategory.TypeConversion,
    inputs: {
        input: { nodeType: 'value', dataType: 'string' }
    },
    outputs: {
        output: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.output} = Number(${inputs.input});`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Boolean to String',
    category: NodeCategory.TypeConversion,
    inputs: {
        input: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        output: { nodeType: 'value', dataType: 'string' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.output} = String(${inputs.input});`
}));

// --- Flow Nodes ---
lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'If',
    category: NodeCategory.Flow,
    inputs: {
        exec: { nodeType: 'flow' },
        condition: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        then: { nodeType: 'flow' },
        else: { nodeType: 'flow' }
    },
    codeGenerator: ({ inputs, body }) => `if (${inputs.condition}) {\n${body.then}\n} else {\n${body.else}\n}`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'While',
    category: NodeCategory.Flow,
    inputs: {
        exec: { nodeType: 'flow' },
        condition: { nodeType: 'value', dataType: 'boolean' }
    },
    outputs: {
        body: { nodeType: 'flow' }
    },
    codeGenerator: ({ inputs, body }) => `while (${inputs.condition}) {\n${body.body}\n}`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'For Loop',
    category: NodeCategory.Flow,
    inputs: {
        exec: { nodeType: 'flow' },
        count: { nodeType: 'value', dataType: 'number' }
    },
    outputs: {
        exec: { nodeType: 'flow' },
        index: { nodeType: 'value', dataType: 'number' }
    },
    codeGenerator: ({ inputs, outputs, body }) => `for (let ${outputs.index} = 0; ${outputs.index} < ${inputs.count}; ${outputs.index}++) {\n${body.body}\n}`
}));

// --- Function Nodes (now with auto exec pins) ---
lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'Console Log',
    category: NodeCategory.Function,
    inputs: { message: { nodeType: 'value', dataType: 'string' } },
    outputs: {},
    codeGenerator: ({ inputs }) => `console.log(${inputs.message});`
}));

lProject.addNodeDefinition(new PotatnoProjectNodeDefinition(lProject, {
    name: 'String Concat',
    category: NodeCategory.Function,
    inputs: { a: { nodeType: 'value', dataType: 'string' }, b: { nodeType: 'value', dataType: 'string' } },
    outputs: { result: { nodeType: 'value', dataType: 'string' } },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} + ${inputs.b};`
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
lProject.addMainFunction({
    name: 'main',
    label: 'Main',
    editableByUser: true,
    inputs: {},
    outputs: {},
    events: [
        { name: 'OnStart', outputs: [] },
        { name: 'OnTick', outputs: [{ name: 'deltaTime', type: 'number' }] }
    ]
});

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
