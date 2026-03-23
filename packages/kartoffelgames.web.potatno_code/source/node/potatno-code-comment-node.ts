import { PotatnoCodeNode } from './potatno-code-node.ts';

/**
 * Code generation node for comment nodes. Comments produce no executable code.
 */
export class PotatnoCodeCommentNode extends PotatnoCodeNode {
    /**
     * Get the comment text from the node properties.
     */
    public get commentText(): string {
        return this.properties.get('comment') ?? '';
    }

    /**
     * Set the comment text in the node properties.
     */
    public set commentText(pValue: string) {
        this.properties.set('comment', pValue);
    }

    /**
     * Generate code for a comment node. Comments produce no executable code.
     *
     * @returns An empty string.
     */
    public override generateCode(): string {
        return '';
    }
}
