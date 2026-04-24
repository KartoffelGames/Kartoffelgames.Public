import type { PotatnoCodeGeneratorFlowPort, PotatnoCodeGeneratorValuePort } from '../../project/potatno-node-definition.ts';

/**
 * Base class for code generation nodes. Subclasses override
 * {@link generateCode} to produce the code string for their node type.
 * The default implementation returns an empty string for nodes that
 * produce no executable code (e.g. input, output, reroute, comment nodes).
 */
export class PotatnoCodeNode {
    private readonly mBody: Map<string, { code: string }>;
    private readonly mInputs: Map<string, PotatnoCodeNodePort>;
    private readonly mOutputs: Map<string, PotatnoCodeNodePort>;

    /**
     * Map of named body code blocks for flow node outputs.
     */
    public get body(): Map<string, { code: string }> {
        return this.mBody;
    }

    /**
     * Map of named input ports with their resolved value identifiers.
     */
    public get inputs(): Map<string, PotatnoCodeNodePort> {
        return this.mInputs;
    }

    /**
     * Map of named output ports with their value identifiers.
     */
    public get outputs(): Map<string, PotatnoCodeNodePort> {
        return this.mOutputs;
    }

    /**
     * Initialize empty maps for inputs, outputs, and body blocks.
     */
    public constructor() {
        this.mInputs = new Map<string, PotatnoCodeNodePort>();
        this.mOutputs = new Map<string, PotatnoCodeNodePort>();
        this.mBody = new Map<string, { code: string }>();
    }

    /**
     * Generate the code string for this node.
     * Returns empty string by default for nodes that produce no executable code.
     *
     * @returns The generated code string.
     */
    public generateCode(): string {
        return '';
    }

    /**
     * Build a typed context from the internal maps, producing the structure
     * expected by the code generator callback.
     *
     * @returns A plain-object context suitable for the code generator callback.
     */
    public buildContext(): PotatnoCodeNodeContext {
        const lInputs: Record<string, PotatnoCodeNodeGeneratorPort> = {};
        for (const [lName, lPort] of this.mInputs) {
            if (lPort.nodeType === 'flow') {
                lInputs[lName] = { code: '' };
            } else {
                lInputs[lName] = { valueId: lPort.valueId };
            }
        }

        const lOutputs: Record<string, PotatnoCodeNodeGeneratorPort> = {};
        for (const [lName, lPort] of this.mOutputs) {
            if (lPort.nodeType === 'flow') {
                const lBody = this.mBody.get(lName);
                lOutputs[lName] = { code: lBody?.code ?? '' };
            } else {
                lOutputs[lName] = { valueId: lPort.valueId };
            }
        }

        return { inputs: lInputs, outputs: lOutputs };
    }
}

/**
 * Port data associated with a code generation node, containing port metadata and the resolved value identifier.
 */
export type PotatnoCodeNodePort = {
    readonly name: string;
    readonly type: string;
    readonly valueId: string;
    readonly nodeType: 'flow' | 'value';
};

/**
 * Generator port data union — represents the data available for a single port in code generation context.
 */
export type PotatnoCodeNodeGeneratorPort = PotatnoCodeGeneratorFlowPort | PotatnoCodeGeneratorValuePort;

/**
 * Context passed to the node code generator callback, built from internal code node data.
 */
export type PotatnoCodeNodeContext = {
    readonly inputs: Record<string, PotatnoCodeNodeGeneratorPort>;
    readonly outputs: Record<string, PotatnoCodeNodeGeneratorPort>;
};
