import { PotatnoCodeNode } from './potatno-code-node.ts';

/**
 * Code generation node that produces code by expanding a template string.
 * Used for operator, function call, and type conversion nodes.
 */
export class PotatnoCodeTemplateNode extends PotatnoCodeNode {
    private readonly mCodeTemplate: string;

    /**
     * Constructor.
     *
     * @param pCodeTemplate - The code template string with placeholders.
     */
    public constructor(pCodeTemplate: string) {
        super();
        this.mCodeTemplate = pCodeTemplate;
    }

    /**
     * Generate code by expanding the stored template.
     *
     * @returns The expanded code string.
     */
    public override generateCode(): string {
        return this.expandTemplate(this.mCodeTemplate);
    }
}
