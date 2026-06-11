/**
 * Test project definition for the PotatnoCode test suite.
 *
 * The project models a small JavaScript-based calculator and exercises every
 * cross-cutting feature of the code generator without depending on the editor
 * UI or the preview layer:
 *
 *  - Three project types: `number`, `string`, `boolean`. `boolean` exists only
 *    as a result of comparison nodes and as the condition input of the `If`
 *    flow node.
 *  - A main `Calculator` function with two entry nodes (`Default`, `X10`) and
 *    two exit nodes (`Default`, `X10`). The `X10` exit wraps each returned
 *    number in `(value * 10)` before returning it.
 *  - A dynamic user function (`Helper`) whose entry and exit ports mirror its
 *    document-level inputs and outputs, so the generator can be exercised
 *    against changing port shapes.
 *  - Arithmetic operators (`Add`, `Subtract`, `Multiply`, `Divide`), boolean
 *    operators (`Equal`, `Greater`, `Smaller`), and parsing nodes
 *    (`NumberToString`, `ParseStringToNumber`).
 *  - A branching `If` flow node with a boolean condition and `then` / `else`
 *    flow outputs.
 *  - A `GlobalMultiplier` node that writes a runtime multiplier into the
 *    function scope. Exit nodes multiply their return values by the
 *    multiplier. The multiplier defaults to `1` and is composed with the
 *    `X10` exit, not replaced by it.
 *  - An import group (`ExtraComparison`) contributing `GreaterOrEqual` and
 *    `SmallerOrEqual` nodes that become available when the import is enabled.
 *
 * Preview definitions are intentionally omitted; the project is consumed by
 * code-generation tests only.
 */

import { PotatnoNodeDefinition } from '../../source/project/node_definition/potatno-node-definition.ts';
import { PotatnoStaticNodeDefinition } from '../../source/project/node_definition/potatno-static-node-definition.ts';
import { PotatnoFunctionDefinition, PotatnoFunctionDefinitionStatics } from '../../source/project/potatno-function-definition.ts';
import { PotatnoImportDefinition } from '../../source/project/potatno-import-definition.ts';
import { PotatnoProjectTypesDefinition } from '../../source/project/potatno-project-types-definition.ts';
import { PotatnoProject } from '../../source/project/potatno-project.ts';

/**
 * Name of the function-scoped variable used to carry the runtime multiplier.
 * Exposed so tests can grep for the symbol in generated code without
 * hard-coding the literal string at multiple call sites.
 */
export const TestProjectGlobalMultiplierVariable: string = '__globalMultiplier';

/*
 * Project type configuration.
 *
 * Every type provides:
 *  - a `default` block used to seed unconnected value inputs in the editor,
 *  - a `convert` callback that turns raw editor input strings into a code-ready
 *    JavaScript literal,
 *  - an `inputs` array describing the editor input fields for the type.
 */
const gProjectTypes = new PotatnoProjectTypesDefinition({
    number: {
        default: {
            string: ['0'],
            value: 0
        },
        convert: (pValues: Array<string>): string => {
            // Parse the editor string and re-emit as a numeric literal so the
            // generated code does not contain unsanitized user input.
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
        convert: (pValues: Array<string>): string => {
            // JSON.stringify produces a quoted, escape-safe JavaScript string
            // literal from the raw editor input.
            return JSON.stringify(pValues[0]);
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
        convert: (pValues: Array<string>): string => {
            const lBooleanString: string = pValues[0].toLowerCase();
            if (lBooleanString === 'true') {
                return 'true';
            }
            if (lBooleanString === 'false') {
                return 'false';
            }
            throw new Error(`Invalid boolean: "${pValues[0]}"`);
        },
        inputs: [
            { name: 'value', type: 'boolean' }
        ]
    }
});

/*
 * Helper user function.
 *
 * A dynamic function whose entry and exit nodes derive their ports from the
 * document-level inputs and outputs. This exists to test the generator
 * against user-defined function shapes and to test how user-function call
 * sites compose with the rest of the graph.
 */
const gHelperFunction = new PotatnoFunctionDefinition({
    id: 'helperFunction',
    label: 'helperFunction',
    statics: PotatnoFunctionDefinitionStatics.none,
    nodes: {
        entry: (pAddNode, pFunction) => {
            // Entry node exposes the function's inputs as value outputs and
            // hands off control via a single `exec` flow output.
            pAddNode(new PotatnoNodeDefinition({
                id: 'HelperEntry',
                label: 'Entry',
                category: 'event',
                generators: {
                    ports: {
                        inputs: (): void => { /* No inputs on entry nodes. */ },
                        outputs: (pAddPort): void => {
                            // Flow handoff.
                            pAddPort({ label: 'exec', id: 'exec', portType: 'flow' });

                            // Mirror each function input as a value output port.
                            for (const lInput of pFunction.inputs) {
                                pAddPort({ label: lInput.label, id: lInput.label, portType: 'value', dataType: lInput.dataType });
                            }
                        }
                    },
                    code: (pContext): string => {
                        // Wrap the downstream flow in an arrow function whose
                        // parameter list mirrors the value outputs of this
                        // entry node (i.e. the function's inputs).
                        const lParameters: string = Object.values(pContext.outputs)
                            .filter((pOutput) => pOutput.value !== '')
                            .map((pOutput) => pOutput.value)
                            .join(', ');

                        return `(${lParameters}) => { let ${TestProjectGlobalMultiplierVariable} = 1; ${pContext.outputs['exec'].code.inner} }`;
                    }
                }
            }));
        },
        exit: (pAddNode, pFunction) => {
            // Exit node mirrors the function's outputs as value inputs and
            // consumes a single `exec` flow input.
            pAddNode(new PotatnoNodeDefinition({
                id: 'HelperExit',
                label: 'Return',
                category: 'event',
                generators: {
                    ports: {
                        outputs: (): void => { /* No outputs on exit nodes. */ },
                        inputs: (pAddPort): void => {
                            // Flow handoff.
                            pAddPort({ label: 'exec', id: 'exec', portType: 'flow' });

                            // Mirror each function output as a value input port.
                            for (const lOutput of pFunction.outputs) {
                                pAddPort({ label: lOutput.label, id: lOutput.label, portType: 'value', dataType: lOutput.dataType });
                            }
                        }
                    },
                    code: (pContext): string => {
                        // Build an object literal of all value inputs (the
                        // function outputs) and emit a single return statement.
                        // The runtime multiplier is applied multiplicatively to
                        // all return values without distinguishing types - the
                        // assumption is that callers wire only number outputs
                        // here, mirroring the Calculator behaviour.
                        const lReturnFields: string = Object.entries(pContext.inputs)
                            .filter(([lId]) => lId !== 'exec')
                            .map(([lId, lInput]) => `${lId}: (${lInput.value}) * ${TestProjectGlobalMultiplierVariable}`)
                            .join(', ');

                        return `return { ${lReturnFields} };`;
                    }
                }
            }));
        }
    },
    generator: {
        code: {
            body: (pResult): string => {
                // Render the function as a named const whose value is the
                // arrow function emitted by the entry node.
                const lGraph = pResult.graphResultOf('HelperEntry');
                return `const ${pResult.function.label} = ${lGraph?.code ?? '() => undefined'};`;
            },
            value: (pContext): string => {
                // The call site emits a call to the document function being
                // invoked, looked up via pContext.function.label. That way
                // every instance of this definition keeps a unique callable
                // name and multi-instance documents work without a second
                // definition.
                const lFunctionName: string = pContext.function.label;

                // Generate a destructuring call expression so each output
                // port receives the corresponding field from the helper
                // function's returned object.
                const lArgs: string = Object.values(pContext.inputs)
                    .map((pInput) => pInput.value)
                    .join(', ');

                const lOutputEntries: Array<[string, string]> = Object.entries(pContext.outputs)
                    .filter(([lId, lOutput]) => lId !== 'exec' && lOutput.value !== '')
                    .map(([lId, lOutput]) => [lId, lOutput.value]);

                // No value outputs - emit a plain call statement.
                if (lOutputEntries.length === 0) {
                    return `${lFunctionName}(${lArgs}); ${pContext.outputs['exec']?.code.inner ?? ''}`;
                }

                // Destructure the returned object into freshly allocated value
                // ids, mapped from the helper function's output port labels.
                const lDestructure: string = lOutputEntries
                    .map(([lId, lValueId]) => `${lId}: ${lValueId}`)
                    .join(', ');

                return `const { ${lDestructure} } = ${lFunctionName}(${lArgs}); ${pContext.outputs['exec']?.code.inner ?? ''}`;
            }
        }
    }
});

/*
 * Main `Calculator` function.
 *
 * Has two static entry nodes (Default, X10) and two static exit nodes
 * (Default, X10). The X10 exit wraps each returned number in `(value * 10)`
 * before returning. All entries and exits expose the same calculator ports:
 *  - entry value outputs: `a: number`, `b: number`
 *  - exit value inputs: `result: number`
 *
 * The entry nodes emit `let __globalMultiplier = 1;` so the GlobalMultiplier
 * node can write to that binding from anywhere downstream.
 */
const gMainFunction = new PotatnoFunctionDefinition({
    id: 'calculator',
    label: 'calculator',
    statics: PotatnoFunctionDefinitionStatics.imports | PotatnoFunctionDefinitionStatics.inputs | PotatnoFunctionDefinitionStatics.outputs,
    nodes: {
        entry: (pAddNode) => {
            // Default entry node.
            pAddNode(new PotatnoStaticNodeDefinition({
                id: 'CalculatorDefaultEntry',
                label: 'Default',
                category: 'event',
                ports: {
                    inputs: [],
                    outputs: [
                        { label: 'exec', id: 'exec', portType: 'flow' },
                        { label: 'a', id: 'a', portType: 'value', dataType: 'number' },
                        { label: 'b', id: 'b', portType: 'value', dataType: 'number' }
                    ]
                },
                generators: {
                    code: (pContext): string => {
                        return `(${pContext.outputs['a'].value}, ${pContext.outputs['b'].value}) => { let ${TestProjectGlobalMultiplierVariable} = 1; ${pContext.outputs['exec'].code.inner} }`;
                    }
                }
            }));

            // X10 entry node.
            //
            // Functionally identical to the Default entry. The X10 designation
            // exists so tests can verify that the function definition supports
            // multiple entry graphs and that each is generated independently.
            pAddNode(new PotatnoStaticNodeDefinition({
                id: 'CalculatorX10Entry',
                label: 'X10',
                category: 'event',
                ports: {
                    inputs: [],
                    outputs: [
                        { label: 'exec', id: 'exec', portType: 'flow' },
                        { label: 'a', id: 'a', portType: 'value', dataType: 'number' },
                        { label: 'b', id: 'b', portType: 'value', dataType: 'number' }
                    ]
                },
                generators: {
                    code: (pContext): string => {
                        return `(${pContext.outputs['a'].value}, ${pContext.outputs['b'].value}) => { let ${TestProjectGlobalMultiplierVariable} = 1; ${pContext.outputs['exec'].code.inner} }`;
                    }
                }
            }));
        },
        exit: (pAddNode) => {
            // Default exit node. Returns `result` multiplied by the runtime
            // multiplier only.
            pAddNode(new PotatnoStaticNodeDefinition({
                id: 'CalculatorDefaultExit',
                label: 'Default',
                category: 'output',
                ports: {
                    inputs: [
                        { label: 'exec', id: 'exec', portType: 'flow' },
                        { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                    ],
                    outputs: []
                },
                generators: {
                    code: (pContext): string => {
                        return `return (${pContext.inputs['result'].value}) * ${TestProjectGlobalMultiplierVariable};`;
                    }
                }
            }));

            // X10 exit node. Wraps the returned number in `(value * 10)` and
            // then composes it with the runtime multiplier. Per the project
            // requirement, X10 and the runtime multiplier compose - they do
            // not override each other.
            pAddNode(new PotatnoStaticNodeDefinition({
                id: 'CalculatorX10Exit',
                label: 'X10',
                category: 'output',
                ports: {
                    inputs: [
                        { label: 'exec', id: 'exec', portType: 'flow' },
                        { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
                    ],
                    outputs: []
                },
                generators: {
                    code: (pContext): string => {
                        return `return ((${pContext.inputs['result'].value}) * 10) * ${TestProjectGlobalMultiplierVariable};`;
                    }
                }
            }));
        }
    },
    generator: {
        code: {
            body: (pResult): string => {
                // The Calculator can be generated against either entry. Emit
                // one named const per entry that was actually present in the
                // graph, suffixed by the entry label so tests can assert each
                // path independently.
                const lDefaultGraph = pResult.graphResultOf('CalculatorDefaultEntry');
                const lX10Graph = pResult.graphResultOf('CalculatorX10Entry');

                const lParts: Array<string> = [];

                if (lDefaultGraph) {
                    lParts.push(`const ${pResult.function.label}Default = ${lDefaultGraph.code};`);
                }

                if (lX10Graph) {
                    lParts.push(`const ${pResult.function.label}X10 = ${lX10Graph.code};`);
                }

                return lParts.join('');
            },
            value: (pContext): string => {
                // The main function is not callable as a node from anywhere
                // else, so the call-site form is only emitted defensively.
                const lArgs: string = Object.values(pContext.inputs)
                    .map((pInput) => pInput.value)
                    .join(', ');
                return `calculatorDefault(${lArgs})`;
            }
        }
    }
});

/*
 * Project initialization.
 *
 * The project's `code` callback concatenates every dependency function's body
 * (e.g. the Helper function when referenced) before the entry point's body so
 * the entry point's emitted const can reference its dependencies.
 *
 * The `hook` callback emits a comment marker that can be left in place of a
 * value identifier and rewritten later. None of the nodes in this test project
 * use it, but it is exercised by serializer / parser tests via the project
 * generator surface.
 */
export const TestProject: PotatnoProject<typeof gProjectTypes> = new PotatnoProject(gProjectTypes, gMainFunction, {
    generator: {
        code: (pContext): string => {
            // Concatenate dependency function bodies first so the entry
            // point can reference them by name.
            let lCodeResult: string = '';

            for (const lDependency of pContext.dependencies) {
                lCodeResult += `${lDependency.code} `;
            }

            // Append the main entry point body.
            lCodeResult += pContext.entryPoint.code;

            return lCodeResult;
        },
        values: {
            valueId: (pValueIndex: number): string => {
                return `v_${pValueIndex}`;
            },
            hook: (pValueId: string): string => {
                return `/*[${pValueId}]*/`;
            }
        }
    }
});
TestProject.setDynamicFunction(gHelperFunction);

/*
 * Pass node.
 *
 * A side-effect-free flow pass-through with no value ports. 
 * Used by code-generator tests to assert flow ordering and branch / merge layout without dragging in the
 * arithmetic operators' value-id chatter.
 */
TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
    id: 'Pass',
    label: 'Pass',
    category: 'flow',
    ports: {
        inputs: [
            { label: 'exec', id: 'exec', portType: 'flow' }
        ],
        outputs: [
            { label: 'exec', id: 'exec', portType: 'flow' }
        ]
    },
    generators: {
        code: (pContext): string => {
            return `/* pass */; ${pContext.outputs['exec'].code.inner}`;
        }
    }
}));

/*
 * Const node.
 *
 * A pure-value node (no flow ports) that takes a single `number` input and
 * re-emits it as its `result` output. Because it has no flow ports the
 * generator's refcount path drives its emission, which lets dedup tests target
 * a node whose emission rules are independent of the arithmetic operators.
 */
TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
    id: 'Const',
    label: 'Const',
    category: 'value',
    ports: {
        inputs: [
            { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
        ],
        outputs: [
            { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
        ]
    },
    generators: {
        code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['value'].value};`
    }
}));

/*
 * Arithmetic nodes.
 *
 * Each emits a `const <result> = <a> <op> <b>;` statement so the generated
 * code can be evaluated as plain JavaScript.
 */
TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
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
        code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} + ${pContext.inputs['b'].value};`
    }
}));

TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
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
        code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} - ${pContext.inputs['b'].value};`
    }
}));

TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
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
        code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} * ${pContext.inputs['b'].value};`
    }
}));

TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
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
        code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} / ${pContext.inputs['b'].value};`
    }
}));

/*
 * Boolean comparison nodes. Produce a `boolean` value output that can only
 * legally feed the `If` condition input.
 */
TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
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
        code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} === ${pContext.inputs['b'].value};`
    }
}));

TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
    id: 'Greater',
    label: 'Greater',
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
        code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} > ${pContext.inputs['b'].value};`
    }
}));

TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
    id: 'Smaller',
    label: 'Smaller',
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
        code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} < ${pContext.inputs['b'].value};`
    }
}));

/*
 * Pick node.
 *
 * Generic value selector: returns the `a` input when `condition` is true,
 * otherwise `b`. Both `a` and `b` share the generic `<T>` data type and the
 * output resolves to the same generic, so the node validates a generic-port
 * round-trip (input resolution via connected output) without committing to
 * a concrete data type.
 *
 * Emitted code wraps the choice in an IIFE so the selection always evaluates
 * exactly one of the two value inputs from the surrounding scope without
 * introducing a statement-level if/else.
 */
TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
    id: 'Pick',
    label: 'Pick',
    category: 'operator',
    ports: {
        inputs: [
            { label: 'a', id: 'a', portType: 'value', dataType: '<T>' },
            { label: 'b', id: 'b', portType: 'value', dataType: '<T>' },
            { label: 'condition', id: 'condition', portType: 'value', dataType: 'boolean' }
        ],
        outputs: [
            { label: 'result', id: 'result', portType: 'value', dataType: '<T>' }
        ]
    },
    generators: {
        code: (pContext): string => {
            const lA: string = pContext.inputs['a'].value;
            const lB: string = pContext.inputs['b'].value;
            const lCondition: string = pContext.inputs['condition'].value;
            const lResult: string = pContext.outputs['result'].value;
            return `const ${lResult} = ((a, b, cond) => { if (cond) { return a; } return b; })(${lA}, ${lB}, ${lCondition});`;
        }
    }
}));

/*
 * Parsing nodes. Convert between `number` and `string`. Two separate nodes
 * keep the directionality explicit and let tests assert each independently.
 */
TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
    id: 'NumberToString',
    label: 'toString',
    category: 'parsing',
    ports: {
        inputs: [
            { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
        ],
        outputs: [
            { label: 'result', id: 'result', portType: 'value', dataType: 'string' }
        ]
    },
    generators: {
        code: (pContext): string => `const ${pContext.outputs['result'].value} = String(${pContext.inputs['value'].value});`
    }
}));

TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
    id: 'ParseStringToNumber',
    label: 'parseString',
    category: 'parsing',
    ports: {
        inputs: [
            { label: 'value', id: 'value', portType: 'value', dataType: 'string' }
        ],
        outputs: [
            { label: 'result', id: 'result', portType: 'value', dataType: 'number' }
        ]
    },
    generators: {
        code: (pContext): string => `const ${pContext.outputs['result'].value} = Number(${pContext.inputs['value'].value});`
    }
}));

/*
 * If flow node. Branches the flow into `then` / `else` based on a boolean
 * condition. `code.next` is appended so the merged tail after the if/else
 * reconverge is rendered after the closing brace.
 */
TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
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
        code: (pContext): string => {
            return `if (${pContext.inputs['condition'].value}) { ${pContext.outputs['then'].code.inner} } else { ${pContext.outputs['else'].code.inner} } ${pContext.code.next}`;
        }
    }
}));

/*
 * Global multiplier node.
 *
 * A flow-pass-through node with a single `number` value input. When executed
 * it writes the input value into the function-scoped multiplier variable.
 * The variable is initialized to `1` by the function's entry node, so omitting
 * this node leaves the multiplier at the neutral value.
 *
 * Because the multiplier is read at the exit-node level, this composes with
 * the X10 exit multiplicatively rather than overriding it.
 */
TestProject.addNodeDefinition(new PotatnoStaticNodeDefinition({
    id: 'GlobalMultiplier',
    label: 'global multiplier',
    category: 'global',
    ports: {
        inputs: [
            { label: 'exec', id: 'exec', portType: 'flow' },
            { label: 'value', id: 'value', portType: 'value', dataType: 'number' }
        ],
        outputs: [
            { label: 'exec', id: 'exec', portType: 'flow' }
        ]
    },
    generators: {
        code: (pContext): string => {
            return `${TestProjectGlobalMultiplierVariable} = ${pContext.inputs['value'].value}; ${pContext.outputs['exec'].code.inner}`;
        }
    }
}));

/*
 * Import group: ExtraComparison.
 *
 * Provides comparison nodes that are not part of the project's base node set.
 * Functions that enable this import (subject to the function's `imports`
 * static flag) gain `GreaterOrEqual` and `SmallerOrEqual` in their node
 * library.
 */
const gExtraComparisonImport = new PotatnoImportDefinition<typeof TestProject>('ExtraComparison', 'Extra Comparison');
gExtraComparisonImport.addNode(new PotatnoStaticNodeDefinition({
    id: 'GreaterOrEqual',
    label: 'greaterOrEqual',
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
        code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} >= ${pContext.inputs['b'].value};`
    }
}));
gExtraComparisonImport.addNode(new PotatnoStaticNodeDefinition({
    id: 'SmallerOrEqual',
    label: 'smallerOrEqual',
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
        code: (pContext): string => `const ${pContext.outputs['result'].value} = ${pContext.inputs['a'].value} <= ${pContext.inputs['b'].value};`
    }
}));
TestProject.addImport(gExtraComparisonImport);
