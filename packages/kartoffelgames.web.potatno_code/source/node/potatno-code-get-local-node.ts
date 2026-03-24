import { PotatnoCodeNode } from './potatno-code-node.ts';

/**
 * Code generation node for "Get Local" variable nodes.
 * Reads a local variable — generates no code, just exposes the variable name as a value.
 */
export class PotatnoCodeGetLocalNode extends PotatnoCodeNode {
    public override generateCode(): string {
        return '';
    }
}
