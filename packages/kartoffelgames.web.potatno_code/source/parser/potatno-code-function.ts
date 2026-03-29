/**
 * The object passed to functionCodeGenerator callbacks.
 * Represents a complete function with its inputs, outputs, and body code.
 */
export class PotatnoCodeFunction {
    public bodyCode: string;
    public readonly inputs: Array<{ name: string; type: string; valueId: string }>;
    public name: string;
    public readonly outputs: Array<{ name: string; type: string; valueId: string }>;

    /**
     * Create a new empty code function instance.
     */
    public constructor() {
        this.name = '';
        this.bodyCode = '';
        this.inputs = new Array<{ name: string; type: string; valueId: string }>();
        this.outputs = new Array<{ name: string; type: string; valueId: string }>();
    }
}
