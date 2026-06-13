import { expect } from '@kartoffelgames/core-test';
import { PotatnoDocumentPort } from '../../source/document/potatno-document-port.ts';
import { PotatnoHelper } from '../helper/potatno-helper.ts';

Deno.test('PotatnoDocumentPort.constructor()', async (pContext) => {
    await pContext.step('Construct flow input', () => {
        // Setup. Process.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultExit.inputs.flow[0];

        // Evaluation.
        expect(lPort.portType).toBe('flow');
        expect(lPort.direction).toBe('input');
    });

    await pContext.step('Construct flow output', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.flow[0];

        // Evaluation.
        expect(lPort.portType).toBe('flow');
        expect(lPort.direction).toBe('output');
    });

    await pContext.step('Construct value input', () => {
        // Setup. Process.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultExit.inputs.value[0];

        // Evaluation.
        expect(lPort.portType).toBe('value');
        expect(lPort.direction).toBe('input');
    });

    await pContext.step('Construct value output', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.value[0];

        // Evaluation.
        expect(lPort.portType).toBe('value');
        expect(lPort.direction).toBe('output');
    });

    await pContext.step('Direct value seeded from project type default for non-generic value ports', () => {
        // Setup. Process. The exit's `result` input is a number value port; the
        // project's number type defaults to ['0'].
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultExit.inputs.value[0];

        // Evaluation.
        expect(lPort.directValue.length).toBe(1);
        expect(lPort.directValue[0]).toBe('0');
    });

    await pContext.step('Direct value empty for flow ports', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.flow[0];

        // Evaluation.
        expect(lPort.directValue.length).toBe(0);
    });

    await pContext.step('Direct value empty for generic value ports', () => {
        // Setup. Process. The Pick node's `a` input is `<T>` - a generic value port.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lPickNode = PotatnoHelper.addProjectNode(lFunction, 'Pick');
        const lPort = lPickNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!;

        // Evaluation.
        expect(lPort.directValue.length).toBe(0);
    });

    await pContext.step('Error', async (pContext) => {
        await pContext.step('Flow port with data type', () => {
            // Setup.
            const { document: lDocument, defaultEntry } = PotatnoHelper.setupCalculatorDocument();

            // Process.
            const lAction = (): void => {
                new PotatnoDocumentPort(PotatnoHelper.TestProject as any, lDocument, {
                    definitionId: 'p', direction: 'input', label: 'p',
                    node: defaultEntry, portType: 'flow', dataType: 'number' as any
                });
            };

            // Evaluation.
            expect(lAction).toThrow('Flow ports cannot have a value type.');
        });

        await pContext.step('Value port without data type', () => {
            // Setup.
            const { document: lDocument, defaultEntry } = PotatnoHelper.setupCalculatorDocument();

            // Process.
            const lAction = (): void => {
                new PotatnoDocumentPort(PotatnoHelper.TestProject as any, lDocument, {
                    definitionId: 'p', direction: 'input', label: 'p',
                    node: defaultEntry, portType: 'value', dataType: null
                });
            };

            // Evaluation.
            expect(lAction).toThrow('Value ports must have a value type.');
        });
    });
});

Deno.test('PotatnoDocumentPort.label', async (pContext) => {
    await pContext.step('Getter returns constructor value', () => {
        // Setup. Process. The Default Entry's `a` output port has label `a`.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!;

        // Evaluation.
        expect(lPort.label).toBe('a');
    });

    await pContext.step('Setter updates label', () => {
        // Setup.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.value[0];

        // Process.
        lPort.label = 'renamed';

        // Evaluation.
        expect(lPort.label).toBe('renamed');
    });
});

Deno.test('PotatnoDocumentPort.definitionId', async (pContext) => {
    await pContext.step('Returns provided id', () => {
        // Setup.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!;

        // Process.
        const lResult: string = lPort.definitionId;

        // Evaluation.
        expect(lResult).toBe('a');
    });
});

Deno.test('PotatnoDocumentPort.direction', async (pContext) => {
    await pContext.step("Returns 'input' for input port", () => {
        // Setup. Process.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultExit.inputs.value[0];

        // Evaluation.
        expect(lPort.direction).toBe('input');
    });

    await pContext.step("Returns 'output' for output port", () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.value[0];

        // Evaluation.
        expect(lPort.direction).toBe('output');
    });
});

Deno.test('PotatnoDocumentPort.portType', async (pContext) => {
    await pContext.step("Returns 'flow' for flow ports", () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.flow[0];

        // Evaluation.
        expect(lPort.portType).toBe('flow');
    });

    await pContext.step("Returns 'value' for value ports", () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.value[0];

        // Evaluation.
        expect(lPort.portType).toBe('value');
    });
});

Deno.test('PotatnoDocumentPort.node', async (pContext) => {
    await pContext.step('Returns the owning node', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.value[0];

        // Evaluation.
        expect(lPort.node).toBe(defaultEntry);
    });
});

Deno.test('PotatnoDocumentPort.document', async (pContext) => {
    await pContext.step('Returns the owning document', () => {
        // Setup. Process.
        const { document, defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.value[0];

        // Evaluation.
        expect(lPort.document).toBe(document);
    });
});

Deno.test('PotatnoDocumentPort.project', async (pContext) => {
    await pContext.step('Returns the owning project', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.value[0];

        // Evaluation.
        expect(lPort.project).toBe(PotatnoHelper.TestProject);
    });
});

Deno.test('PotatnoDocumentPort.dataType', async (pContext) => {
    await pContext.step('Returns the configured data type', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.value[0];

        // Evaluation.
        expect(lPort.dataType).toBe('number');
    });

    await pContext.step('Returns null when none (flow port)', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.flow[0];

        // Evaluation.
        expect(lPort.dataType).toBeNull();
    });
});

Deno.test('PotatnoDocumentPort.directValue', async (pContext) => {
    await pContext.step('Reflects seeded default', () => {
        // Setup. Process.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultExit.inputs.value[0];

        // Evaluation.
        expect([...lPort.directValue]).toEqual(['0']);
    });

    await pContext.step('Reflects set value', () => {
        // Setup.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultExit.inputs.value[0];

        // Process.
        lPort.setDirectValue(['42']);

        // Evaluation.
        expect([...lPort.directValue]).toEqual(['42']);
    });
});

Deno.test('PotatnoDocumentPort.connectedPorts', async (pContext) => {
    await pContext.step('Empty after construction', () => {
        // Setup. Process.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.flow[0];

        // Evaluation.
        expect(lPort.connectedPorts.size).toBe(0);
    });

    await pContext.step('Contains the peer after connect()', () => {
        // Setup.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lSource = defaultEntry.outputs.flow[0];
        const lTarget = defaultExit.inputs.flow[0];

        // Process.
        lSource.connect(lTarget);

        // Evaluation.
        expect(lSource.connectedPorts.has(lTarget)).toBe(true);
    });

    await pContext.step('Does not contain the peer after disconnect()', () => {
        // Setup.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lSource = defaultEntry.outputs.flow[0];
        const lTarget = defaultExit.inputs.flow[0];
        lSource.connect(lTarget);

        // Process.
        lSource.disconnect(lTarget);

        // Evaluation.
        expect(lSource.connectedPorts.has(lTarget)).toBe(false);
    });
});

Deno.test('PotatnoDocumentPort.connect()', async (pContext) => {
    await pContext.step('Connects an output value to an input value of matching type', () => {
        // Setup.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lSource = defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!;
        const lTarget = defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!;

        // Process.
        lSource.connect(lTarget);

        // Evaluation.
        expect(lSource.connectedPorts.has(lTarget)).toBe(true);
        expect(lTarget.connectedPorts.has(lSource)).toBe(true);
    });

    await pContext.step('Connects flow output to flow input', () => {
        // Setup.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lSource = defaultEntry.outputs.flow[0];
        const lTarget = defaultExit.inputs.flow[0];

        // Process.
        lSource.connect(lTarget);

        // Evaluation.
        expect(lSource.connectedPorts.has(lTarget)).toBe(true);
    });

    await pContext.step('Bidirectional - both ports list each other after a single call', () => {
        // Setup.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lSource = defaultEntry.outputs.flow[0];
        const lTarget = defaultExit.inputs.flow[0];

        // Process.
        lSource.connect(lTarget);

        // Evaluation.
        expect(lSource.connectedPorts.has(lTarget)).toBe(true);
        expect(lTarget.connectedPorts.has(lSource)).toBe(true);
    });

    await pContext.step('Flow input allows multiple incoming connections', () => {
        // Setup. Two Pass nodes both feeding into the exit's flow input.
        const { function: lFunction, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lPassOne = PotatnoHelper.addProjectNode(lFunction, 'Pass');
        const lPassTwo = PotatnoHelper.addProjectNode(lFunction, 'Pass');
        const lExitFlow = defaultExit.inputs.flow[0];

        // Process.
        lPassOne.outputs.flow[0].connect(lExitFlow);
        lPassTwo.outputs.flow[0].connect(lExitFlow);

        // Evaluation.
        expect(lExitFlow.connectedPorts.size).toBe(2);
    });

    await pContext.step('Value output allows multiple outgoing connections', () => {
        // Setup. Entry's `a` output fanning into two Add nodes.
        const { function: lFunction, defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lAddOne = PotatnoHelper.addProjectNode(lFunction, 'Add');
        const lAddTwo = PotatnoHelper.addProjectNode(lFunction, 'Add');
        const lSourceValue = defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!;

        // Process.
        lSourceValue.connect(lAddOne.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
        lSourceValue.connect(lAddTwo.inputs.value.find((pPort) => pPort.definitionId === 'a')!);

        // Evaluation.
        expect(lSourceValue.connectedPorts.size).toBe(2);
    });

    await pContext.step('Flow output replaces an existing connection when a second is added (1-export rule)', () => {
        // Setup. Two Pass nodes downstream of a single flow output.
        const { function: lFunction, defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPassOne = PotatnoHelper.addProjectNode(lFunction, 'Pass');
        const lPassTwo = PotatnoHelper.addProjectNode(lFunction, 'Pass');
        const lSourceFlow = defaultEntry.outputs.flow[0];

        // Process.
        lSourceFlow.connect(lPassOne.inputs.flow[0]);
        lSourceFlow.connect(lPassTwo.inputs.flow[0]);

        // Evaluation. Only the latest connection remains on the flow output.
        expect(lSourceFlow.connectedPorts.size).toBe(1);
        expect(lSourceFlow.connectedPorts.has(lPassTwo.inputs.flow[0])).toBe(true);
    });

    await pContext.step('Value input replaces an existing connection when a second is added (1-import rule)', () => {
        // Setup. Two Add outputs feeding the same value input.
        const { function: lFunction, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lAddOne = PotatnoHelper.addProjectNode(lFunction, 'Add');
        const lAddTwo = PotatnoHelper.addProjectNode(lFunction, 'Add');
        const lTargetInput = defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!;

        // Process.
        lAddOne.outputs.value[0].connect(lTargetInput);
        lAddTwo.outputs.value[0].connect(lTargetInput);

        // Evaluation. Only the latest connection remains on the value input.
        expect(lTargetInput.connectedPorts.size).toBe(1);
        expect(lTargetInput.connectedPorts.has(lAddTwo.outputs.value[0])).toBe(true);
    });

    await pContext.step('Idempotent for an already-connected pair', () => {
        // Setup.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lSource = defaultEntry.outputs.flow[0];
        const lTarget = defaultExit.inputs.flow[0];
        lSource.connect(lTarget);

        // Process.
        lSource.connect(lTarget);

        // Evaluation.
        expect(lSource.connectedPorts.size).toBe(1);
    });

    await pContext.step('Error', async (pContext) => {
        await pContext.step('Mismatched port types', () => {
            // Setup.
            const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lFlowOutput = defaultEntry.outputs.flow[0];
            const lValueInput = defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!;

            // Process.
            const lAction = (): void => {
                lFlowOutput.connect(lValueInput);
            };

            // Evaluation.
            const lMessage: string = `Cannot connect port ${lFlowOutput.definitionId} of node ${defaultEntry.label} to port ${lValueInput.definitionId} of node ${defaultExit.label} due to incompatible port types.`;
            expect(lAction).toThrow(lMessage);
        });

        await pContext.step('Same direction', () => {
            // Setup. Two value-output ports on the same node (Entry has a and b).
            const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
            const lA = defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!;
            const lB = defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!;

            // Process.
            const lAction = (): void => {
                lA.connect(lB);
            };

            // Evaluation.
            const lMessage: string = `Cannot connect port ${lA.definitionId} of node ${defaultEntry.label} to port ${lB.definitionId} of node ${defaultEntry.label} due to incompatible directions.`;
            expect(lAction).toThrow(lMessage);
        });
    });
});

Deno.test('PotatnoDocumentPort.disconnect()', async (pContext) => {
    await pContext.step('Removes a connection', () => {
        // Setup.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lSource = defaultEntry.outputs.flow[0];
        const lTarget = defaultExit.inputs.flow[0];
        lSource.connect(lTarget);

        // Process.
        lSource.disconnect(lTarget);

        // Evaluation.
        expect(lSource.connectedPorts.size).toBe(0);
    });

    await pContext.step('Bidirectional', () => {
        // Setup.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lSource = defaultEntry.outputs.flow[0];
        const lTarget = defaultExit.inputs.flow[0];
        lSource.connect(lTarget);

        // Process.
        lSource.disconnect(lTarget);

        // Evaluation.
        expect(lTarget.connectedPorts.size).toBe(0);
    });

    await pContext.step('No-op when not connected', () => {
        // Setup.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lSource = defaultEntry.outputs.flow[0];
        const lTarget = defaultExit.inputs.flow[0];

        // Process.
        lSource.disconnect(lTarget);

        // Evaluation.
        expect(lSource.connectedPorts.size).toBe(0);
    });
});

Deno.test('PotatnoDocumentPort.setDirectValue()', async (pContext) => {
    await pContext.step('Updates direct value for value port', () => {
        // Setup.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!;

        // Process.
        lPort.setDirectValue(['7']);

        // Evaluation.
        expect([...lPort.directValue]).toEqual(['7']);
    });

    await pContext.step('Preserves length contract by replacing in place', () => {
        // Setup.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!;
        const lReferenceArray = lPort.directValue;

        // Process.
        lPort.setDirectValue(['99']);

        // Evaluation. Same underlying array reference (mutated in place).
        expect(lPort.directValue).toBe(lReferenceArray);
        expect([...lReferenceArray]).toEqual(['99']);
    });

    await pContext.step('Error', async (pContext) => {
        await pContext.step('Flow port', () => {
            // Setup.
            const { defaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lPort = defaultExit.inputs.flow[0];

            // Process.
            const lAction = (): void => {
                lPort.setDirectValue(['x']);
            };

            // Evaluation.
            expect(lAction).toThrow('Only value ports can have a direct value.');
        });

        await pContext.step('Generic port', () => {
            // Setup. Pick's `a` input is `<T>`.
            const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
            const lPickNode = PotatnoHelper.addProjectNode(lFunction, 'Pick');
            const lPort = lPickNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!;

            // Process.
            const lAction = (): void => {
                lPort.setDirectValue(['x']);
            };

            // Evaluation.
            expect(lAction).toThrow('Generic value ports cannot have a direct value.');
        });

        await pContext.step('Length mismatch', () => {
            // Setup.
            const { defaultExit } = PotatnoHelper.setupCalculatorDocument();
            const lPort = defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!;

            // Process.
            const lAction = (): void => {
                lPort.setDirectValue(['1', '2']);
            };

            // Evaluation.
            expect(lAction).toThrow("The provided value does not match the expected length of the default value for this port's type.");
        });
    });
});

Deno.test('PotatnoDocumentPort.resolvedDataType', async (pContext) => {
    await pContext.step('Returns same as dataType for non-generic value ports', () => {
        // Setup.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.value[0];

        // Process.
        const lResult = lPort.resolvedDataType;

        // Evaluation.
        expect(lResult).toBe('number');
    });

    await pContext.step('Throws for flow ports', () => {
        // Setup.
        const { defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.flow[0];

        // Process.
        const lAction = (): string => {
            return lPort.resolvedDataType;
        };

        // Evaluation.
        expect(lAction).toThrow("Port data type couldn't be resolved as it is no value port.");
    });

    await pContext.step('Output generic port resolves via connected input port on the same node with the same generic', () => {
        // Setup. Wire Const(number) into Pick.a; Pick.result is <T> and resolves to number.
        const { function: lFunction, defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPickNode = PotatnoHelper.addProjectNode(lFunction, 'Pick');
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
            .connect(lPickNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);

        // Process.
        const lResult = lPickNode.outputs.value.find((pPort) => pPort.definitionId === 'result')!.resolvedDataType;

        // Evaluation.
        expect(lResult).toBe('number');
    });

    await pContext.step('Output generic port throws when no resolving input exists', () => {
        // Setup. Pick with no inputs connected.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lPickNode = PotatnoHelper.addProjectNode(lFunction, 'Pick');

        // Process.
        const lAction = (): string => {
            return lPickNode.outputs.value.find((pPort) => pPort.definitionId === 'result')!.resolvedDataType;
        };

        // Evaluation.
        expect(lAction).toThrow("Port type couldn't be resolved as it has no resolving input port");
    });

    await pContext.step('Input generic port resolves via its connected output port', () => {
        // Setup.
        const { function: lFunction, defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPickNode = PotatnoHelper.addProjectNode(lFunction, 'Pick');
        const lPickAInput = lPickNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!;
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!.connect(lPickAInput);

        // Process.
        const lResult = lPickAInput.resolvedDataType;

        // Evaluation.
        expect(lResult).toBe('number');
    });

    await pContext.step('Input generic port throws when not connected', () => {
        // Setup.
        const { function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lPickNode = PotatnoHelper.addProjectNode(lFunction, 'Pick');
        const lPickAInput = lPickNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!;

        // Process.
        const lAction = (): string => {
            return lPickAInput.resolvedDataType;
        };

        // Evaluation.
        expect(lAction).toThrow("Port type couldn't be resolved as it has no resolving input port");
    });
});

Deno.test('PotatnoDocumentPort - Validation', async (pContext) => {
    await pContext.step('Output flow with single connection', () => {
        // Setup.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultEntry.outputs.flow[0];
        lPort.connect(defaultExit.inputs.flow[0]);

        // Process.
        const lErrors = lPort.validate();

        // Evaluation.
        expect(lErrors.length).toBe(0);
    });

    await pContext.step('Output flow with multiple connections', () => {
        // Setup. Force two connections by going through the port set directly.
        const { defaultEntry, function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lPassOne = PotatnoHelper.addProjectNode(lFunction, 'Pass');
        const lPassTwo = PotatnoHelper.addProjectNode(lFunction, 'Pass');
        const lFlowOutput = defaultEntry.outputs.flow[0];
        // Manually push a second connection by reusing the set surfaces.
        lFlowOutput.connect(lPassOne.inputs.flow[0]);
        lFlowOutput.connectedPorts.add(lPassTwo.inputs.flow[0]);

        // Process.
        const lErrors = lFlowOutput.validate();

        // Evaluation.
        expect(lErrors.length).toBe(1);
        expect(lErrors[0].message).toBe(`Flow output port "${lFlowOutput.definitionId}" on node "${defaultEntry.label}" can only have one connection.`);
    });

    await pContext.step('Output value generic resolved', () => {
        // Setup.
        const { function: lFunction, defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPickNode = PotatnoHelper.addProjectNode(lFunction, 'Pick');
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
            .connect(lPickNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
            .connect(lPickNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);

        // Process.
        const lErrors = lPickNode.outputs.value.find((pPort) => pPort.definitionId === 'result')!.validate();

        // Evaluation.
        expect(lErrors.length).toBe(0);
    });

    await pContext.step('Output value generic unresolved', () => {
        // Setup. Only `a` connected, `b` left unconnected — output cannot resolve `<T>`.
        const { function: lFunction, defaultEntry } = PotatnoHelper.setupCalculatorDocument();
        const lPickNode = PotatnoHelper.addProjectNode(lFunction, 'Pick');
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
            .connect(lPickNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);

        // Process.
        const lOutput = lPickNode.outputs.value.find((pPort) => pPort.definitionId === 'result')!;
        const lErrors = lOutput.validate();

        // Evaluation.
        expect(lErrors.length).toBe(1);
        expect(lErrors[0].message).toBe(`Generic output port "${lOutput.definitionId}" on node "${lPickNode.label}" cannot resolve generic type "<T>" because its input port "b" is not connected.`);
    });

    await pContext.step('Input flow connected', () => {
        // Setup.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        defaultEntry.outputs.flow[0].connect(defaultExit.inputs.flow[0]);

        // Process.
        const lErrors = defaultExit.inputs.flow[0].validate();

        // Evaluation.
        expect(lErrors.length).toBe(0);
    });

    await pContext.step('Input flow unconnected', () => {
        // Setup.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultExit.inputs.flow[0];

        // Process.
        const lErrors = lPort.validate();

        // Evaluation.
        expect(lErrors.length).toBe(1);
        expect(lErrors[0].message).toBe(`Flow input port "${lPort.definitionId}" on node "${defaultExit.label}" must have at least one connection.`);
    });

    await pContext.step('Input value with single matching connection', () => {
        // Setup.
        const { defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
            .connect(defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!);

        // Process.
        const lErrors = defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!.validate();

        // Evaluation.
        expect(lErrors.length).toBe(0);
    });

    await pContext.step('Input value with multiple connections', () => {
        // Setup. Force two connections by reaching past the connect() 1-import rule.
        const { defaultEntry, defaultExit, function: lFunction } = PotatnoHelper.setupCalculatorDocument();
        const lAddNode = PotatnoHelper.addProjectNode(lFunction, 'Add');
        const lTarget = defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!;
        const lFirstSource = defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!;
        const lSecondSource = lAddNode.outputs.value[0];
        lFirstSource.connect(lTarget);
        lTarget.connectedPorts.add(lSecondSource);

        // Process.
        const lErrors = lTarget.validate();

        // Evaluation.
        expect(lErrors.length).toBe(1);
        expect(lErrors[0].message).toBe(`Value input port "${lTarget.definitionId}" on node "${defaultExit.label}" can only have one connection.`);
    });

    await pContext.step('Input value with type mismatch', () => {
        // Setup. Wire a Boolean-producing Greater output into a number value input.
        const { function: lFunction, defaultEntry, defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lGreaterNode = PotatnoHelper.addProjectNode(lFunction, 'Greater');
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'a')!
            .connect(lGreaterNode.inputs.value.find((pPort) => pPort.definitionId === 'a')!);
        defaultEntry.outputs.value.find((pPort) => pPort.definitionId === 'b')!
            .connect(lGreaterNode.inputs.value.find((pPort) => pPort.definitionId === 'b')!);
        const lTarget = defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!;
        lGreaterNode.outputs.value[0].connect(lTarget);

        // Process.
        const lErrors = lTarget.validate();

        // Evaluation.
        expect(lErrors.length).toBe(1);
        expect(lErrors[0].message).toBe(`Value input port "${lTarget.definitionId}" on node "${defaultExit.label}" expects type "number" but is connected to type "boolean".`);
    });

    await pContext.step('Input value unconnected', () => {
        // Setup.
        const { defaultExit } = PotatnoHelper.setupCalculatorDocument();
        const lPort = defaultExit.inputs.value.find((pPort) => pPort.definitionId === 'result')!;

        // Process.
        const lErrors = lPort.validate();

        // Evaluation. No errors - direct value will be used.
        expect(lErrors.length).toBe(0);
    });
});
