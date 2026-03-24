import type { NodeCategory } from './node-category.enum.ts';
import type { PotatnoPortDefinition } from './potatno-port-definition.ts';

/**
 * Typed context passed to the node code generator callback.
 * All maps are plain JS objects for type safety and easy destructuring.
 */
export interface NodeCodeContext {
    /** Input port valueIds keyed by port name. */
    readonly inputs: Readonly<Record<string, string>>;
    /** Output port valueIds keyed by port name. */
    readonly outputs: Readonly<Record<string, string>>;
    /** Property values keyed by property name. */
    readonly properties: Readonly<Record<string, string>>;
    /** Body code blocks keyed by flow output name (for flow nodes). */
    readonly body: Readonly<Record<string, string>>;
}

/**
 * Definition of a node type that can be registered with the editor project.
 * Uses a {@link codeGenerator} callback that receives a typed {@link NodeCodeContext}.
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
    /** Code generator callback that produces the code string from a typed context. */
    readonly codeGenerator?: (pContext: NodeCodeContext) => string;
}
