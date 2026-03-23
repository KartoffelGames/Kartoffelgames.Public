import { PotatnoCodeNode } from './potatno-code-node.ts';

/**
 * Code generation node for function input nodes. Input nodes represent
 * function parameters and produce no direct code output.
 */
export class PotatnoCodeInputNode extends PotatnoCodeNode {
    /**
     * Generate code for an input node. Input nodes produce no direct code
     * as they are handled by the function wrapper.
     *
     * @returns An empty string.
     */
    public override generateCode(): string {
        return '';
    }
}
