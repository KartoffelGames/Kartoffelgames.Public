// Public API
export { PotatnoCodeEditor } from './component/editor/potatno-code-editor.ts';

// Enums
export { NodeCategory, NODE_CATEGORY_META } from './data_model/enum/node-category.enum.ts';
export { PortDirection } from './data_model/enum/port-direction.enum.ts';
export { PortKind } from './data_model/enum/port-kind.enum.ts';

// Configuration Types
export type { PotatnoNodeDefinition } from './data_model/configuration/potatno-node-definition.ts';
export type { PotatnoPortDefinition } from './data_model/configuration/potatno-port-definition.ts';
export type { PotatnoMainFunctionDefinition } from './data_model/configuration/potatno-main-function-definition.ts';
export type { PotatnoGlobalValueDefinition } from './data_model/configuration/potatno-global-value-definition.ts';

// Code Generation Types
export { PotatnoCodeNode } from './data_model/code_generation/potatno-code-node.ts';
export { PotatnoCodeFunction } from './data_model/code_generation/potatno-code-function.ts';
