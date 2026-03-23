import type { PotatnoCodeNode } from './potatno-code-node.ts';
import type { NodeCategory } from './node-category.enum.ts';
import type { PotatnoPortDefinition } from './potatno-port-definition.ts';

/**
 * Definition of a node type that can be registered with the editor project.
 * The {@link codeTemplate} uses placeholder syntax: `${input:name}`, `${output:name}`,
 * `${property:name}`, and `${body:name}` for flow nodes.
 */
export interface PotatnoNodeDefinition {
    /** Unique display name for this node type. */
    readonly name: string;
    /** Category classification determining which subclass is instantiated for code generation. */
    readonly category: NodeCategory;
    /** Data input port definitions. */
    readonly inputs: Array<PotatnoPortDefinition>;
    /** Data output port definitions. */
    readonly outputs: Array<PotatnoPortDefinition>;
    /** Flow input port names. Only used by flow-category nodes. */
    readonly flowInputs?: Array<string>;
    /** Flow output port names. Only used by flow-category nodes. */
    readonly flowOutputs?: Array<string>;
    /**
     * Code template with placeholders for code generation.
     * Comment, Input, and Output nodes do not require a template.
     */
    readonly codeTemplate?: string;
    /** Optional callback that produces a preview DocumentFragment for a node instance. */
    readonly previewCallback?: (pNode: PotatnoCodeNode) => DocumentFragment;
}
