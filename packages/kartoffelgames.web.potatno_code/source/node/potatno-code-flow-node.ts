import { PotatnoCodeTemplateNode } from './potatno-code-template-node.ts';

/**
 * Code generation node for flow control nodes such as if, while, and for loops.
 * Flow nodes use the code template with body placeholders like `${body:then}`.
 */
export class PotatnoCodeFlowNode extends PotatnoCodeTemplateNode {
    // Flow nodes use the base template expansion which already handles
    // ${body:name} placeholders via the body map on PotatnoCodeNode.
}
