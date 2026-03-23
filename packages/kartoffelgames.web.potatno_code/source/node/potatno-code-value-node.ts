import { PotatnoCodeTemplateNode } from './potatno-code-template-node.ts';

/**
 * Code generation node for literal value nodes such as numbers, strings, and booleans.
 * Provides typed access to the node's value property.
 */
export class PotatnoCodeValueNode extends PotatnoCodeTemplateNode {
    /**
     * Get the literal value from the node properties.
     */
    public get value(): string {
        return this.properties.get('value') ?? '';
    }

    /**
     * Set the literal value in the node properties.
     */
    public set value(pValue: string) {
        this.properties.set('value', pValue);
    }
}
