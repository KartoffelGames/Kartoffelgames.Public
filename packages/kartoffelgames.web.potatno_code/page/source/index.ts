import { PotatnoCodeApplication } from '../../source/potatno-code-application.ts';
import { NodeCodeContext, PotatnoProject } from '../../source/project/potatno-project.ts';
import { PotatnoCodeFile } from '../../source/document/potatno-code-file.ts';
import { NodeCategory } from '../../source/node/node-category.enum.ts';
import type { PotatnoCodeFunction } from '../../source/project/potatno-code-function.ts';

// --- Project configuration ---
const lProject: PotatnoProject = new PotatnoProject();

// --- Comment token ---
lProject.setCommentToken('//');

// --- Imports (replaces defineGlobalValue) ---
lProject.addImport({
    name: 'Math',
    nodes: [
        {
            name: 'Math.PI',
            category: NodeCategory.Value,
            inputs: {},
            outputs: [{ name: 'value', type: 'number' }],
            codeGenerator: ({ outputs }: NodeCodeContext) => `const ${outputs.value} = Math.PI;`
        },
        {
            name: 'Math.E',
            category: NodeCategory.Value,
            inputs: {},
            outputs: [{ name: 'value', type: 'number' }],
            codeGenerator: ({ outputs }: NodeCodeContext) => `const ${outputs.value} = Math.E;`
        },
        {
            name: 'Math.abs',
            category: NodeCategory.Function,
            inputs: [{ name: 'value', type: 'number' }],
            outputs: [{ name: 'result', type: 'number' }],
            codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = Math.abs(${inputs.value});`
        },
        {
            name: 'Math.floor',
            category: NodeCategory.Function,
            inputs: [{ name: 'value', type: 'number' }],
            outputs: [{ name: 'result', type: 'number' }],
            codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = Math.floor(${inputs.value});`
        },
        {
            name: 'Math.random',
            category: NodeCategory.Function,
            inputs: {},
            outputs: [{ name: 'result', type: 'number' }],
            codeGenerator: ({ outputs }: NodeCodeContext) => `const ${outputs.result} = Math.random();`
        }
    ]
});

// --- Global inputs/outputs ---
lProject.addGlobalInput({ name: 'time', type: 'number' });
lProject.addGlobalOutput({ name: 'result', type: 'string' });

// --- Value Nodes ---
lProject.addNodeDefinition({
    name: 'Number Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: { value: { type: 'number' } },
    codeGenerator: ({ outputs, properties }) => `const ${outputs.value} = ${properties.value};`
});

lProject.addNodeDefinition({
    name: 'String Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: { value: { type: 'string' } },
    codeGenerator: ({ outputs, properties }: NodeCodeContext) => `const ${outputs.value} = "${properties.value}";`
});

lProject.addNodeDefinition({
    name: 'Boolean Literal',
    category: NodeCategory.Value,
    inputs: {},
    outputs: { value: { type: 'boolean' } },
    codeGenerator: ({ outputs, properties }: NodeCodeContext) => `const ${outputs.value} = ${properties.value};`
});

// --- Operator Nodes: Arithmetic ---
lProject.addNodeDefinition({
    name: 'Add',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: { result: { type: 'number' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = ${inputs.a} + ${inputs.b};`
});

lProject.addNodeDefinition({
    name: 'Subtract',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: { result: { type: 'number' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = ${inputs.a} - ${inputs.b};`
});

lProject.addNodeDefinition({
    name: 'Multiply',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: { result: { type: 'number' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = ${inputs.a} * ${inputs.b};`
});

lProject.addNodeDefinition({
    name: 'Divide',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: { result: { type: 'number' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = ${inputs.a} / ${inputs.b};`
});

lProject.addNodeDefinition({
    name: 'Modulo',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: { result: { type: 'number' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = ${inputs.a} % ${inputs.b};`
});

// --- Operator Nodes: Comparison ---
lProject.addNodeDefinition({
    name: 'Equal',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: { result: { type: 'boolean' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = ${inputs.a} === ${inputs.b};`
});

lProject.addNodeDefinition({
    name: 'Not Equal',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: { result: { type: 'boolean' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = ${inputs.a} !== ${inputs.b};`
});

lProject.addNodeDefinition({
    name: 'Less Than',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: { result: { type: 'boolean' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = ${inputs.a} < ${inputs.b};`
});

lProject.addNodeDefinition({
    name: 'Greater Than',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: { result: { type: 'boolean' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = ${inputs.a} > ${inputs.b};`
});

// --- Operator Nodes: Logic ---
lProject.addNodeDefinition({
    name: 'And',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'boolean' }, { name: 'b', type: 'boolean' }],
    outputs: { result: { type: 'boolean' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = ${inputs.a} && ${inputs.b};`
});

lProject.addNodeDefinition({
    name: 'Or',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'boolean' }, { name: 'b', type: 'boolean' }],
    outputs: { result: { type: 'boolean' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = ${inputs.a} || ${inputs.b};`
});

lProject.addNodeDefinition({
    name: 'Not',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'boolean' }],
    outputs: { result: { type: 'boolean' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.result} = !${inputs.a};`
});

// --- Type Conversion Nodes ---
lProject.addNodeDefinition({
    name: 'Number to String',
    category: NodeCategory.TypeConversion,
    inputs: [{ name: 'input', type: 'number' }],
    outputs: { output: { type: 'string' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.output} = String(${inputs.input});`
});

lProject.addNodeDefinition({
    name: 'String to Number',
    category: NodeCategory.TypeConversion,
    inputs: [{ name: 'input', type: 'string' }],
    outputs: { output: { type: 'number' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.output} = Number(${inputs.input});`
});

lProject.addNodeDefinition({
    name: 'Boolean to String',
    category: NodeCategory.TypeConversion,
    inputs: [{ name: 'input', type: 'boolean' }],
    outputs: { output: { type: 'string' } },
    codeGenerator: ({ inputs, outputs }: NodeCodeContext) => `const ${outputs.output} = String(${inputs.input});`
});

// --- Flow Nodes ---
lProject.addNodeDefinition({
    name: 'If',
    category: NodeCategory.Flow,
    inputs: { 
        condition: { type: 'boolean' } 
    },
    outputs: {},
    flowInputs: ['exec'],
    flowOutputs: ['then', 'else'],
    codeGenerator: ({ inputs, body }) => `if (${inputs.condition}) {\n${body.then}\n} else {\n${body.else}\n}`
});

lProject.addNodeDefinition({
    name: 'While',
    category: NodeCategory.Flow,
    inputs: {
        condition: { type: 'boolean' }
    },
    outputs: {},
    flowInputs: ['exec'],
    flowOutputs: ['body'],
    codeGenerator: ({ inputs, body }) => `while (${inputs.condition}) {\n${body.body}\n}`
});

lProject.addNodeDefinition({
    name: 'For Loop',
    category: NodeCategory.Flow,
    inputs: { count: { type: 'number' } },
    outputs: { index: { type: 'number' } },
    flowInputs: ['exec'],
    flowOutputs: ['body'],
    codeGenerator: ({ inputs, outputs, body }) => `for (let ${outputs.index} = 0; ${outputs.index} < ${inputs.count}; ${outputs.index}++) {\n${body.body}\n}`
});

// --- Function Nodes (now with auto exec pins) ---
lProject.addNodeDefinition({
    name: 'Console Log',
    category: NodeCategory.Function,
    inputs: {
        message: { type: 'string' }
    },
    outputs: {},
    codeGenerator: ({ inputs }) => `console.log(${inputs.message});`
});

lProject.addNodeDefinition({
    name: 'String Concat',
    category: NodeCategory.Function,
    inputs: {
        a: { name: '', type: 'string' },
        b: { name: '', type: 'string' }
    },
    outputs: {
        result: { type: 'string' }
    },
    codeGenerator: ({ inputs, outputs }) => `const ${outputs.result} = ${inputs.a} + ${inputs.b};`
});

// --- Reroute Node ---
lProject.addNodeDefinition({
    name: 'Reroute',
    category: NodeCategory.Reroute,
    inputs: {
        in: { name: '', type: 'any' }
    },
    outputs: {
        out: { name: '', type: 'any' }
    }
});

// --- Comment Node ---
lProject.addNodeDefinition({
    name: 'Comment',
    category: NodeCategory.Comment,
    inputs: {},
    outputs: {}
});

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
