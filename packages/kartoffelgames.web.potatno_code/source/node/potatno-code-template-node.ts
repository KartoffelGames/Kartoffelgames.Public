import { PotatnoCodeNode, type PotatnoCodeNodeContext } from './potatno-code-node.ts';

/**
 * Code generation node that produces code by invoking a callback with a typed context.
 * Used for operator, function call, and type conversion nodes.
 */
export class PotatnoCodeTemplateNode extends PotatnoCodeNode {
    private readonly mCodeGenerator: (pContext: PotatnoCodeNodeContext) => string;

    /**
     * Constructor.
     *
     * @param pCodeGenerator - The callback that generates code from a typed context.
     */
    public constructor(pCodeGenerator: (pContext: PotatnoCodeNodeContext) => string) {
        super();
        this.mCodeGenerator = pCodeGenerator;
    }

    /**
     * Generate code by invoking the callback with the current context.
     *
     * @returns The generated code string.
     */
    public override generateCode(): string {
        return this.mCodeGenerator(this.buildContext());
    }
}
