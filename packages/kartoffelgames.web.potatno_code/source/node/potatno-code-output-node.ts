import { PotatnoCodeNode } from './potatno-code-node.ts';

/**
 * Code generation node for function output nodes. Output nodes represent
 * function return values and produce no direct code output.
 */
export class PotatnoCodeOutputNode extends PotatnoCodeNode {
    /**
     * Generate code for an output node. Output nodes produce no direct code
     * as they are handled by the function wrapper.
     *
     * @returns An empty string.
     */
    public override generateCode(): string {
        return '';
    }
}
