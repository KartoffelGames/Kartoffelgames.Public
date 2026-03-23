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
     * Expand a code template by replacing placeholder tokens with actual values.
     * Supported placeholders: `${input:name}`, `${output:name}`, `${property:name}`, `${body:name}`.
     *
     * @param pTemplate - The template string containing placeholders.
     *
     * @returns The expanded code string.
     */
    protected expandTemplate(pTemplate: string): string {
        return pTemplate.replace(/\$\{(input|output|property|body):([^}]+)\}/g, (_pMatch: string, pType: string, pName: string): string => {
            switch (pType) {
                case 'input':
                    return this.mInputs.get(pName)?.valueId ?? '';
                case 'output':
                    return this.mOutputs.get(pName)?.valueId ?? '';
                case 'property':
                    return this.mProperties.get(pName) ?? '';
                case 'body':
                    return this.mBody.get(pName)?.code ?? '';
                default:
                    return '';
            }
        });
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
