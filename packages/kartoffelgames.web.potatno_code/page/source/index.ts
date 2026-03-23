import { PotatnoCodeApplication } from '../../source/potatno-code-application.ts';
import { PotatnoProject } from '../../source/project/potatno-project.ts';
import { PotatnoCodeFile } from '../../source/document/potatno-code-file.ts';
import { NodeCategory } from '../../source/node/node-category.enum.ts';
import type { PotatnoCodeFunction } from '../../source/project/potatno-code-function.ts';

// --- Project configuration ---
const lProject: PotatnoProject = new PotatnoProject();

// --- Comment token ---
lProject.setCommentToken('//');

// --- Global values ---
lProject.defineGlobalValue({ name: 'Math_PI', type: 'number', label: 'Math.PI' });
lProject.defineGlobalValue({ name: 'Math_E', type: 'number', label: 'Math.E' });

// --- Value Nodes ---
lProject.defineNode({
    name: 'Number Literal',
    category: NodeCategory.Value,
    inputs: [],
    outputs: [{ name: 'value', type: 'number' }],
    codeTemplate: 'const ${output:value} = ${property:value};'
});

lProject.defineNode({
    name: 'String Literal',
    category: NodeCategory.Value,
    inputs: [],
    outputs: [{ name: 'value', type: 'string' }],
    codeTemplate: 'const ${output:value} = "${property:value}";'
});

lProject.defineNode({
    name: 'Boolean Literal',
    category: NodeCategory.Value,
    inputs: [],
    outputs: [{ name: 'value', type: 'boolean' }],
    codeTemplate: 'const ${output:value} = ${property:value};'
});

// --- Operator Nodes: Arithmetic ---
lProject.defineNode({
    name: 'Add',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeTemplate: 'const ${output:result} = ${input:a} + ${input:b};'
});

lProject.defineNode({
    name: 'Subtract',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeTemplate: 'const ${output:result} = ${input:a} - ${input:b};'
});

lProject.defineNode({
    name: 'Multiply',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeTemplate: 'const ${output:result} = ${input:a} * ${input:b};'
});

lProject.defineNode({
    name: 'Divide',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeTemplate: 'const ${output:result} = ${input:a} / ${input:b};'
});

lProject.defineNode({
    name: 'Modulo',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeTemplate: 'const ${output:result} = ${input:a} % ${input:b};'
});

// --- Operator Nodes: Comparison ---
lProject.defineNode({
    name: 'Equal',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeTemplate: 'const ${output:result} = ${input:a} === ${input:b};'
});

lProject.defineNode({
    name: 'Not Equal',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeTemplate: 'const ${output:result} = ${input:a} !== ${input:b};'
});

lProject.defineNode({
    name: 'Less Than',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeTemplate: 'const ${output:result} = ${input:a} < ${input:b};'
});

lProject.defineNode({
    name: 'Greater Than',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeTemplate: 'const ${output:result} = ${input:a} > ${input:b};'
});

// --- Operator Nodes: Logic ---
lProject.defineNode({
    name: 'And',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'boolean' }, { name: 'b', type: 'boolean' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeTemplate: 'const ${output:result} = ${input:a} && ${input:b};'
});

lProject.defineNode({
    name: 'Or',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'boolean' }, { name: 'b', type: 'boolean' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeTemplate: 'const ${output:result} = ${input:a} || ${input:b};'
});

lProject.defineNode({
    name: 'Not',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'boolean' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeTemplate: 'const ${output:result} = !${input:a};'
});

// --- Type Conversion Nodes ---
lProject.defineNode({
    name: 'Number to String',
    category: NodeCategory.TypeConversion,
    inputs: [{ name: 'input', type: 'number' }],
    outputs: [{ name: 'output', type: 'string' }],
    codeTemplate: 'const ${output:output} = String(${input:input});'
});

lProject.defineNode({
    name: 'String to Number',
    category: NodeCategory.TypeConversion,
    inputs: [{ name: 'input', type: 'string' }],
    outputs: [{ name: 'output', type: 'number' }],
    codeTemplate: 'const ${output:output} = Number(${input:input});'
});

lProject.defineNode({
    name: 'Boolean to String',
    category: NodeCategory.TypeConversion,
    inputs: [{ name: 'input', type: 'boolean' }],
    outputs: [{ name: 'output', type: 'string' }],
    codeTemplate: 'const ${output:output} = String(${input:input});'
});

// --- Flow Nodes ---
lProject.defineNode({
    name: 'If',
    category: NodeCategory.Flow,
    inputs: [{ name: 'condition', type: 'boolean' }],
    outputs: [],
    flowInputs: ['exec'],
    flowOutputs: ['then', 'else'],
    codeTemplate: 'if (${input:condition}) {\n${body:then}\n} else {\n${body:else}\n}'
});

lProject.defineNode({
    name: 'While',
    category: NodeCategory.Flow,
    inputs: [{ name: 'condition', type: 'boolean' }],
    outputs: [],
    flowInputs: ['exec'],
    flowOutputs: ['body'],
    codeTemplate: 'while (${input:condition}) {\n${body:body}\n}'
});

lProject.defineNode({
    name: 'For Loop',
    category: NodeCategory.Flow,
    inputs: [{ name: 'count', type: 'number' }],
    outputs: [{ name: 'index', type: 'number' }],
    flowInputs: ['exec'],
    flowOutputs: ['body'],
    codeTemplate: 'for (let ${output:index} = 0; ${output:index} < ${input:count}; ${output:index}++) {\n${body:body}\n}'
});

// --- Function Nodes ---
lProject.defineNode({
    name: 'Console Log',
    category: NodeCategory.Function,
    inputs: [{ name: 'message', type: 'string' }],
    outputs: [],
    codeTemplate: 'console.log(${input:message});'
});

lProject.defineNode({
    name: 'String Concat',
    category: NodeCategory.Function,
    inputs: [{ name: 'a', type: 'string' }, { name: 'b', type: 'string' }],
    outputs: [{ name: 'result', type: 'string' }],
    codeTemplate: 'const ${output:result} = ${input:a} + ${input:b};'
});

lProject.defineNode({
    name: 'Math.abs',
    category: NodeCategory.Function,
    inputs: [{ name: 'value', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeTemplate: 'const ${output:result} = Math.abs(${input:value});'
});

lProject.defineNode({
    name: 'Math.floor',
    category: NodeCategory.Function,
    inputs: [{ name: 'value', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeTemplate: 'const ${output:result} = Math.floor(${input:value});'
});

lProject.defineNode({
    name: 'Math.random',
    category: NodeCategory.Function,
    inputs: [],
    outputs: [{ name: 'result', type: 'number' }],
    codeTemplate: 'const ${output:result} = Math.random();'
});

// --- Comment Node ---
lProject.defineNode({
    name: 'Comment',
    category: NodeCategory.Comment,
    inputs: [],
    outputs: []
});

// --- Function Code Generator ---
lProject.setFunctionCodeGenerator((pFunc: PotatnoCodeFunction) => {
    const lParams: string = pFunc.inputs.map((i: { valueId: string }) => i.valueId).join(', ');
    const lReturnStmt: string = pFunc.outputs.length > 0
        ? `\n    return ${pFunc.outputs[0].valueId};`
        : '';
    return `function ${pFunc.name}(${lParams}) {\n${pFunc.bodyCode}${lReturnStmt}\n}`;
});

// --- Main Functions ---
lProject.defineMainFunction({
    name: 'main',
    label: 'Main',
    editableByUser: true,
    inputs: [],
    outputs: []
});

// --- Preview ---
let lPreviewPre: HTMLPreElement;

lProject.setCreatePreview((pContainer: HTMLElement) => {
    lPreviewPre = document.createElement('pre');
    lPreviewPre.style.cssText = 'color: #cdd6f4; margin: 0; padding: 8px; font-family: "Cascadia Code", "Fira Code", monospace; font-size: 13px; white-space: pre-wrap; word-break: break-all;';
    pContainer.appendChild(lPreviewPre);
});

lProject.setUpdatePreview((pCode: string) => {
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
});

// --- Create application and open an empty file ---
const lApp: PotatnoCodeApplication = new PotatnoCodeApplication(lProject);
lApp.appendTo(document.body);
lApp.file = new PotatnoCodeFile();
