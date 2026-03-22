import { PwbApplication } from '@kartoffelgames/web-potato-web-builder';
import { NodeCategory, PotatnoCodeEditor } from '../../source/index.ts';
import type { PotatnoNodeDefinition, PotatnoCodeNode, PotatnoCodeFunction } from '../../source/index.ts';
import themeCss from '../../source/component/global/potatno-theme.css';

// Create the application and editor via PwbApplication.
let lEditor: any;

PwbApplication.new('potatno-code', (pApp: PwbApplication) => {
    pApp.addStyle(themeCss);
    pApp.addStyle(':host { display: block; width: 100%; height: 100%; } potatno-code-editor { display: block; width: 100%; height: 100%; }');
    pApp.addContent(PotatnoCodeEditor);
}, document.body);

// Find the editor element inside the application shadow root.
const lAppDiv: HTMLElement | null = document.body.lastElementChild as HTMLElement;
lEditor = lAppDiv?.shadowRoot?.querySelector('potatno-code-editor');

// --- Comment token ---
lEditor.setCommentToken('//');

// --- Global values ---
lEditor.defineGlobalValue({ name: 'Math_PI', type: 'number', label: 'Math.PI' });
lEditor.defineGlobalValue({ name: 'Math_E', type: 'number', label: 'Math.E' });

// --- Value Nodes ---
lEditor.defineNode({
    name: 'Number Literal',
    category: NodeCategory.Value,
    inputs: [],
    outputs: [{ name: 'value', type: 'number' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        const lVal: string = pNode.properties.get('value') ?? '0';
        return `const ${pNode.outputs.get('value')!.valueId} = ${lVal};`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'String Literal',
    category: NodeCategory.Value,
    inputs: [],
    outputs: [{ name: 'value', type: 'string' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        const lVal: string = pNode.properties.get('value') ?? '';
        return `const ${pNode.outputs.get('value')!.valueId} = "${lVal}";`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Boolean Literal',
    category: NodeCategory.Value,
    inputs: [],
    outputs: [{ name: 'value', type: 'boolean' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        const lVal: string = pNode.properties.get('value') ?? 'false';
        return `const ${pNode.outputs.get('value')!.valueId} = ${lVal};`;
    }
} satisfies PotatnoNodeDefinition);

// --- Operator Nodes: Arithmetic ---
lEditor.defineNode({
    name: 'Add',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = ${pNode.inputs.get('a')!.valueId} + ${pNode.inputs.get('b')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Subtract',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = ${pNode.inputs.get('a')!.valueId} - ${pNode.inputs.get('b')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Multiply',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = ${pNode.inputs.get('a')!.valueId} * ${pNode.inputs.get('b')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Divide',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = ${pNode.inputs.get('a')!.valueId} / ${pNode.inputs.get('b')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Modulo',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = ${pNode.inputs.get('a')!.valueId} % ${pNode.inputs.get('b')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

// --- Operator Nodes: Comparison ---
lEditor.defineNode({
    name: 'Equal',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = ${pNode.inputs.get('a')!.valueId} === ${pNode.inputs.get('b')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Not Equal',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = ${pNode.inputs.get('a')!.valueId} !== ${pNode.inputs.get('b')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Less Than',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = ${pNode.inputs.get('a')!.valueId} < ${pNode.inputs.get('b')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Greater Than',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = ${pNode.inputs.get('a')!.valueId} > ${pNode.inputs.get('b')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

// --- Operator Nodes: Logic ---
lEditor.defineNode({
    name: 'And',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'boolean' }, { name: 'b', type: 'boolean' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = ${pNode.inputs.get('a')!.valueId} && ${pNode.inputs.get('b')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Or',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'boolean' }, { name: 'b', type: 'boolean' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = ${pNode.inputs.get('a')!.valueId} || ${pNode.inputs.get('b')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Not',
    category: NodeCategory.Operator,
    inputs: [{ name: 'a', type: 'boolean' }],
    outputs: [{ name: 'result', type: 'boolean' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = !${pNode.inputs.get('a')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

// --- Type Conversion Nodes ---
lEditor.defineNode({
    name: 'Number to String',
    category: NodeCategory.TypeConversion,
    inputs: [{ name: 'input', type: 'number' }],
    outputs: [{ name: 'output', type: 'string' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('output')!.valueId} = String(${pNode.inputs.get('input')!.valueId});`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'String to Number',
    category: NodeCategory.TypeConversion,
    inputs: [{ name: 'input', type: 'string' }],
    outputs: [{ name: 'output', type: 'number' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('output')!.valueId} = Number(${pNode.inputs.get('input')!.valueId});`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Boolean to String',
    category: NodeCategory.TypeConversion,
    inputs: [{ name: 'input', type: 'boolean' }],
    outputs: [{ name: 'output', type: 'string' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('output')!.valueId} = String(${pNode.inputs.get('input')!.valueId});`;
    }
} satisfies PotatnoNodeDefinition);

// --- Flow Nodes ---
lEditor.defineNode({
    name: 'If',
    category: NodeCategory.Flow,
    inputs: [{ name: 'condition', type: 'boolean' }],
    outputs: [],
    flowInputs: ['exec'],
    flowOutputs: ['then', 'else'],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        const lThenCode: string = pNode.body.get('then')?.code ?? '';
        const lElseCode: string = pNode.body.get('else')?.code ?? '';
        return `if (${pNode.inputs.get('condition')!.valueId}) {\n${lThenCode}\n} else {\n${lElseCode}\n}`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'While',
    category: NodeCategory.Flow,
    inputs: [{ name: 'condition', type: 'boolean' }],
    outputs: [],
    flowInputs: ['exec'],
    flowOutputs: ['body'],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        const lBodyCode: string = pNode.body.get('body')?.code ?? '';
        return `while (${pNode.inputs.get('condition')!.valueId}) {\n${lBodyCode}\n}`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'For Loop',
    category: NodeCategory.Flow,
    inputs: [{ name: 'count', type: 'number' }],
    outputs: [{ name: 'index', type: 'number' }],
    flowInputs: ['exec'],
    flowOutputs: ['body'],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        const lIdx: string = pNode.outputs.get('index')!.valueId;
        const lBodyCode: string = pNode.body.get('body')?.code ?? '';
        return `for (let ${lIdx} = 0; ${lIdx} < ${pNode.inputs.get('count')!.valueId}; ${lIdx}++) {\n${lBodyCode}\n}`;
    }
} satisfies PotatnoNodeDefinition);

// --- Function Nodes ---
lEditor.defineNode({
    name: 'Console Log',
    category: NodeCategory.Function,
    inputs: [{ name: 'message', type: 'string' }],
    outputs: [],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `console.log(${pNode.inputs.get('message')!.valueId});`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'String Concat',
    category: NodeCategory.Function,
    inputs: [{ name: 'a', type: 'string' }, { name: 'b', type: 'string' }],
    outputs: [{ name: 'result', type: 'string' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = ${pNode.inputs.get('a')!.valueId} + ${pNode.inputs.get('b')!.valueId};`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Math.abs',
    category: NodeCategory.Function,
    inputs: [{ name: 'value', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = Math.abs(${pNode.inputs.get('value')!.valueId});`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Math.floor',
    category: NodeCategory.Function,
    inputs: [{ name: 'value', type: 'number' }],
    outputs: [{ name: 'result', type: 'number' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = Math.floor(${pNode.inputs.get('value')!.valueId});`;
    }
} satisfies PotatnoNodeDefinition);

lEditor.defineNode({
    name: 'Math.random',
    category: NodeCategory.Function,
    inputs: [],
    outputs: [{ name: 'result', type: 'number' }],
    codeGenerator: (pNode: PotatnoCodeNode) => {
        return `const ${pNode.outputs.get('result')!.valueId} = Math.random();`;
    }
} satisfies PotatnoNodeDefinition);

// --- Comment Node ---
lEditor.defineNode({
    name: 'Comment',
    category: NodeCategory.Comment,
    inputs: [],
    outputs: [],
    codeGenerator: (_pNode: PotatnoCodeNode) => {
        return ''; // Comments produce no code.
    }
} satisfies PotatnoNodeDefinition);

// --- Function Code Generator ---
lEditor.setFunctionCodeGenerator((pFunc: PotatnoCodeFunction) => {
    const lParams: string = pFunc.inputs.map((i: { valueId: string }) => i.valueId).join(', ');
    const lReturnStmt: string = pFunc.outputs.length > 0
        ? `\n    return ${pFunc.outputs[0].valueId};`
        : '';
    return `function ${pFunc.name}(${lParams}) {\n${pFunc.bodyCode}${lReturnStmt}\n}`;
});

// --- Main Functions ---
lEditor.defineMainFunction({
    name: 'main',
    label: 'Main',
    editableByUser: true,
    inputs: [

    ],
    outputs: [

    ]
});

// --- Preview Callback ---
lEditor.setPreviewCallback((pCode: string) => {
    const lFragment: DocumentFragment = document.createDocumentFragment();
    const lPre: HTMLPreElement = document.createElement('pre');
    lPre.style.cssText = 'color: #cdd6f4; margin: 0; padding: 8px; font-family: "Cascadia Code", "Fira Code", monospace; font-size: 13px; white-space: pre-wrap; word-break: break-all;';

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
            lPre.textContent = lResult.join('\n');
        } else {
            lPre.textContent = '(no output)';
            lPre.style.color = '#6c7086';
        }
    } catch (pError: any) {
        lPre.textContent = `Error: ${pError.message ?? pError}`;
        lPre.style.color = '#f38ba8';
    }

    lFragment.appendChild(lPre);
    return lFragment;
});

// --- Initialize ---
lEditor.initialize();
