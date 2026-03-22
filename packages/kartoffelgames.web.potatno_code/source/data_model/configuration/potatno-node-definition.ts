import type { PotatnoCodeNode } from '../code_generation/potatno-code-node.ts';
import type { NodeCategory } from '../enum/node-category.enum.ts';
import type { PotatnoPortDefinition } from './potatno-port-definition.ts';

/**
 * Definition of a node type that can be registered with the editor.
 */
export interface PotatnoNodeDefinition {
    readonly name: string;
    readonly category: NodeCategory;
    readonly inputs: Array<PotatnoPortDefinition>;
    readonly outputs: Array<PotatnoPortDefinition>;
    readonly flowInputs?: Array<string>;
    readonly flowOutputs?: Array<string>;
    readonly codeGenerator: (node: PotatnoCodeNode) => string;
}
