import { PotatnoCodeNode } from './potatno-code-node.ts';

/**
 * Code generation node for reroute/knot nodes. Passes the input value
 * through to the output — generates no code of its own.
 */
export class PotatnoCodeRerouteNode extends PotatnoCodeNode {
    /**
     * Reroute nodes generate no code. The value passthrough is handled
     * at the graph level by resolving the connected input's valueId.
     */
    public override generateCode(): string {
        return '';
    }
}
