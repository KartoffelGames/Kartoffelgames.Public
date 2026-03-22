/**
 * The object passed to node codeGenerator callbacks.
 * Provides access to input/output value IDs and body code for flow nodes.
 */
export class PotatnoCodeNode {
    public readonly body: Map<string, { code: string }>;
    public readonly inputs: Map<string, { name: string; type: string; valueId: string }>;
    public readonly outputs: Map<string, { name: string; type: string; valueId: string }>;
    public readonly properties: Map<string, string>;

    public constructor() {
        this.inputs = new Map<string, { name: string; type: string; valueId: string }>();
        this.outputs = new Map<string, { name: string; type: string; valueId: string }>();
        this.body = new Map<string, { code: string }>();
        this.properties = new Map<string, string>();
    }
}
