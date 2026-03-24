import type { NodeCodeContext } from './potatno-node-definition.ts';

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
     * Build a typed {@link NodeCodeContext} from the internal maps.
     *
     * @returns A plain-object context suitable for the code generator callback.
     */
    protected buildContext(): NodeCodeContext {
        const lInputs: Record<string, string> = {};
        for (const [lName, lPort] of this.mInputs) {
            lInputs[lName] = lPort.valueId;
        }

        const lOutputs: Record<string, string> = {};
        for (const [lName, lPort] of this.mOutputs) {
            lOutputs[lName] = lPort.valueId;
        }

        const lProperties: Record<string, string> = {};
        for (const [lKey, lValue] of this.mProperties) {
            lProperties[lKey] = lValue || 'undefined';
        }

        const lBody: Record<string, string> = {};
        for (const [lName, lBlock] of this.mBody) {
            lBody[lName] = lBlock.code;
        }

        return { inputs: lInputs, outputs: lOutputs, properties: lProperties, body: lBody };
    }
}

/**
 * Port data associated with a code generation node, containing port metadata and the resolved value identifier.
 */
export type PotatnoCodeNodePort = {
    readonly name: string;
    readonly type: string;
    readonly valueId: string;
};
