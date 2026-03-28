import type { PotatnoCodeGeneratorFlowPort, PotatnoCodeGeneratorInputPort, PotatnoCodeGeneratorValuePort } from '../project/potatno-node-definition.ts';

/**
 * Generator port data union — represents the data available for a single port in code generation context.
 */
export type PotatnoCodeNodeGeneratorPort = PotatnoCodeGeneratorFlowPort | PotatnoCodeGeneratorValuePort | PotatnoCodeGeneratorInputPort;

/**
 * Context passed to the node code generator callback, built from internal code node data.
 */
export type PotatnoCodeNodeContext = {
    readonly inputs: Record<string, PotatnoCodeNodeGeneratorPort>;
    readonly outputs: Record<string, PotatnoCodeNodeGeneratorPort>;
};

/**
 * Abstract base class for code generation nodes. Each concrete subclass
 * implements {@link generateCode} to produce the code string for its node type.
 */
export abstract class PotatnoCodeNode {
    private readonly mBody: Map<string, { code: string }>;
    private readonly mInputs: Map<string, PotatnoCodeNodePort>;
    private readonly mOutputs: Map<string, PotatnoCodeNodePort>;
    private readonly mProperties: Map<string, string>;

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
     * Map of named properties for this node instance.
     */
    public get properties(): Map<string, string> {
        return this.mProperties;
    }

    /**
     * Initialize empty maps for inputs, outputs, body blocks, and properties.
     */
    public constructor() {
        this.mInputs = new Map<string, PotatnoCodeNodePort>();
        this.mOutputs = new Map<string, PotatnoCodeNodePort>();
        this.mBody = new Map<string, { code: string }>();
        this.mProperties = new Map<string, string>();
    }

    /**
     * Generate the code string for this node.
     *
     * @returns The generated code string.
     */
    public abstract generateCode(): string;

    /**
     * Build a typed context from the internal maps, producing the structure
     * expected by the code generator callback.
     *
     * @returns A plain-object context suitable for the code generator callback.
     */
    protected buildContext(): PotatnoCodeNodeContext {
        const lInputs: Record<string, PotatnoCodeNodeGeneratorPort> = {};
        for (const [lName, lPort] of this.mInputs) {
            switch (lPort.nodeType) {
                case 'flow':
                    lInputs[lName] = { code: '' };
                    break;
                case 'input':
                    lInputs[lName] = { value: this.mProperties.get(lName) ?? '', valueId: lPort.valueId };
                    break;
                case 'value':
                    lInputs[lName] = { valueId: lPort.valueId };
                    break;
            }
        }

        const lOutputs: Record<string, PotatnoCodeNodeGeneratorPort> = {};
        for (const [lName, lPort] of this.mOutputs) {
            switch (lPort.nodeType) {
                case 'flow': {
                    const lBody = this.mBody.get(lName);
                    lOutputs[lName] = { code: lBody?.code ?? '' };
                    break;
                }
                case 'input':
                    lOutputs[lName] = { value: this.mProperties.get(lName) ?? '', valueId: lPort.valueId };
                    break;
                case 'value':
                    lOutputs[lName] = { valueId: lPort.valueId };
                    break;
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
    readonly nodeType: 'flow' | 'value' | 'input';
};
